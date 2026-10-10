import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext/browser';

const TO = 'contato@arthlabs.dev';
const FROM = 'noreply@arthlabs.dev';
const MAX_NAME = 200;
const MAX_MESSAGE = 5000;

const MAIN_HOST = 'arthlabs.dev';
const LINKS_HOST = 'links.arthlabs.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${MAIN_HOST}`) {
      return redirect(`https://${MAIN_HOST}${url.pathname}${url.search}`);
    }

    if (url.hostname === LINKS_HOST) {
      return handleLinksHost(request, env, url);
    }

    if (url.pathname === '/links' || url.pathname === '/links/') {
      return redirect(`https://${LINKS_HOST}/`);
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'method_not_allowed' }, 405);
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

// links.arthlabs.dev serves only the links page and the static files it
// needs; any other path belongs to the main site.
function handleLinksHost(request, env, url) {
  if (url.pathname === '/') {
    return env.ASSETS.fetch(new Request(new URL('/links/', url), request));
  }
  if (isStaticFile(url.pathname)) {
    return env.ASSETS.fetch(request);
  }
  return redirect(`https://${MAIN_HOST}${url.pathname}${url.search}`);
}

function isStaticFile(pathname) {
  // /_astro/*.css, /images/*.webp, /favicon.svg, …
  return /\/[^/]+\.[a-z0-9]+$/i.test(pathname);
}

function redirect(location) {
  return new Response(null, { status: 301, headers: { location } });
}

async function handleContact(request, env) {
  const wantsJson = (request.headers.get('content-type') || '').includes('application/json');

  let data;
  try {
    if (wantsJson) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form);
    }
  } catch {
    return respond(wantsJson, false, 'invalid_body', 400);
  }

  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim();
  const message = String(data.message ?? '').trim();
  const honeypot = String(data.company ?? '').trim();

  // Honeypot: bots fill the hidden "company" field. Silently accept, don't send.
  if (honeypot) {
    return respond(wantsJson, true, null, 200);
  }

  if (!name || !email || !message) {
    return respond(wantsJson, false, 'missing_fields', 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return respond(wantsJson, false, 'invalid_email', 400);
  }
  if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return respond(wantsJson, false, 'too_long', 400);
  }

  try {
    const msg = createMimeMessage();
    msg.setSender({ name: 'arThLabs · contato', addr: FROM });
    msg.setRecipient(TO);
    msg.setSubject(`[arthlabs.dev] Contato de ${name}`);
    msg.setHeader('Reply-To', new Mailbox(email));
    msg.addMessage({
      contentType: 'text/plain',
      data:
        `Nova solicitação de contato via arthlabs.dev\n\n` +
        `Nome:  ${name}\n` +
        `Email: ${email}\n\n` +
        `Mensagem:\n${message}\n`,
    });
    await env.SEB.send(new EmailMessage(FROM, TO, msg.asRaw()));
  } catch (err) {
    return respond(wantsJson, false, 'send_failed', 502, String(err));
  }

  return respond(wantsJson, true, null, 200);
}

function respond(wantsJson, ok, error, status, detail) {
  if (wantsJson) {
    const body = ok ? { ok: true } : { ok: false, error, ...(detail ? { detail } : {}) };
    return json(body, status);
  }
  // No-JS fallback: redirect back to the page with a status flag.
  const location = ok ? '/contact/?sent=1' : '/contact/?error=1';
  return new Response(null, { status: 303, headers: { location } });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
