import { ImapFlow } from 'imapflow';
import { simpleParser, ParsedMail } from 'mailparser';

export async function startEmailListener() {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER || '',
      pass: process.env.GMAIL_APP_PASSWORD || '', // MUST generate App Password
    },
    logger: false,
  });

  await client.connect();

  const mainLoop = async () => {
    while (client.usable) {
      // Wrapper to handle mailbox lock and idle
      let lock = await client.getMailboxLock('INBOX');
      try {
        // Fetch any unseen messages immediately upon connection/waking up
        await fetchAndProcessMessages(client);

        // Wait for new messages
        // idle() returns distinct boolean if IDLE was interrupted by something
        // We just wait here until an event happens (like new mail)
        await client.idle();
      } catch (error) {
        console.error('IMAP Idle Error:', error);
      } finally {
        lock.release();
      }
    }
  };

  mainLoop().catch((err) => {
    console.error('IMAP Listener Error:', err);
    client.logout();
  });
}

async function fetchAndProcessMessages(client: ImapFlow) {
  try {
    // Fetch unseen messages
    // fetch returns an async generator
    const messages = client.fetch({ seen: false }, { source: true, uid: true });

    for await (const msg of messages) {
      const source = msg.source;
      if (source) {
        const parsed = await simpleParser(source);
        console.log('📥 New vendor email received from:', parsed.from?.text);
        console.log('Subject:', parsed.subject);

        await processVendorReply(parsed);

        // Mark as seen
        await client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true });
      }
    }
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

import { proposalService } from '../module/proposal/service';

async function processVendorReply(parsed: ParsedMail) {
  await proposalService.processVendorReply(parsed);
}
