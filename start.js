import config from "config";
import {createProxySmtpServer} from "./app.js";

const configs = [config].flat();
for (const config of configs) {
    createProxySmtpServer(config);
}
