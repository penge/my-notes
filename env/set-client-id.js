const fs = require("fs"); // eslint-disable-line

const MY_NOTES_CLIENT_ID_DEFAULT = "813847979218-unbbh8m0el8vjdi74rnqdarm1mhv3985.apps.googleusercontent.com";
const clientId = process.env.MY_NOTES_CLIENT_ID || MY_NOTES_CLIENT_ID_DEFAULT;

const manifestPath = process.argv.slice(2)[0];
const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
manifestContent.oauth2.client_id = clientId;
fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
