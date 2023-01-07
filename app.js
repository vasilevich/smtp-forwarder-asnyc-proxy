import {SMTPServer} from "smtp-server";
import {simpleParser as parser} from "mailparser";
import nodemailer from "nodemailer";

/**
 * Creates a new SMTP proxy server with the given configuration.
 *
 * @param {Object} config - The configuration object for the proxy server.
 * @param {Object[]} config.source - An array of source server objects.
 * @param {string} config.source[].host - The hostname of the source server.
 * @param {number} config.source[].port - The port number of the source server.
 * @param {Object[]} config.destination - An array of destination server objects.
 * @param {string} config.destination[].host - The hostname of the destination server.
 * @param {number} config.destination[].port - The port number of the destination server.
 * @returns {Object[]} The created proxy server object.
 */
export const createProxySmtpServer = (config) => {
    const sources = [config.source].flat();
    const destinations = [config.destination].flat();
    const listeners = [];
    for (const source of sources) {
        const {host, port, allowedIps, restOfSource} = source;
        const server = new SMTPServer({
            async onData(stream, session, callback) {
                const parsed = await parser(stream, {});
                callback();
                const {username, password} = session.user || {};
                for (const destination of destinations) {
                    const transport = nodemailer.createTransport({
                        host: config.destination.host,
                        port: config.destination.port,
                        secure: config.destination.secure,
                        auth: username && password && {user: username, pass: password},
                    });
                    const message = {
                        from: parsed.from.text,
                        to: parsed.to.text,
                        subject: parsed.subject,
                        text: parsed.text,
                        html: parsed.html,
                    };
                    const response = await transport.sendMail(message);
                }
            },
            onAuth: (auth, session, callback) => {
                //   console.log("Auth:", auth, session);
                callback(null, {user: auth});
            },
            onConnect: (session, callback) => {
                //   console.log("Connection:", session);
                if (Array.isArray(allowedIps) && allowedIps.length > 0) {
                    if (allowedIps.includes(session.remoteAddress)) {
                        callback();
                    } else {
                        callback(new Error(`Not allowed IP ${session.remoteAddress}`));
                    }
                } else {
                    callback();
                }
            },
            authOptional: true,
            hideSTARTTLS: true,
            allowInsecureAuth: true,
            disableReverseLookup: true,
            ...restOfSource,
        });
        console.log(`listening on ${host}:${port}`);
        listeners.push(server.listen(port, host));
        for (const destination of destinations) {
            console.log(`forwarding to ${destination.host}:${destination.port}`);
        }
    }
    return listeners;
};

export default createProxySmtpServer;
