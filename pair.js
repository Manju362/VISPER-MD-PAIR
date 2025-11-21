const { makeid } = require('./gen-id');

const express = require('express');

const fs = require('fs');



// GitHub API සඳහා Octokit

const { Octokit } = require('@octokit/rest');

let router = express.Router();

const pino = require("pino");



const botRepoUrl = "https://github.com/tharusha-md2008";

const Wachannellink = "https://whatsapp.com/channel/0029Vb9LTRHInlqISdCfln45";



const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, getAggregateVotesInPollMessage, DisconnectReason, WA_DEFAULT_EPHEMERAL, jidNormalizedUser, proto, getDevice, generateWAMessageFromContent, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys')



// GitHub Token එක Environment Variables වලින් ලබා ගැනීම

const GITHUB_TOKEN = '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'; 

const GITHUB_OWNER = 'THEMISADAS2007';

const GITHUB_REPO = 'SESSION-DB'; 

const GITHUB_PATH = process.env.GITHUB_PATH || 'sessions'; // default path එක



// Octokit Instance එක සකස් කිරීම

const octokit = new Octokit({

    auth: GITHUB_TOKEN,

});



function removeFile(FilePath) {

    if (!fs.existsSync(FilePath)) return false;

    fs.rmSync(FilePath, { recursive: true, force: true });

}



/**

 * GitHub API භාවිතා කරමින් ගොනුවක් උඩුගත කිරීම

 * @param {string} filePath - උඩුගත කළ යුතු දේශීය ගොනුවේ මාර්ගය

 * @param {string} githubFilePath - GitHub Repository එකේ ගොනුවේ මාර්ගය

 * @param {string} commitMessage - Commit Message එක

 * @returns {Promise<string>} - උඩුගත කළ ගොනුවේ නම (session ID ලෙස)

 */

async function uploadToGitHub(filePath, githubFilePath, commitMessage) {

    const fileContent = fs.readFileSync(filePath);

    // GitHub API එකට base64 encoding අවශ්‍යයි

    const contentBase64 = Buffer.from(fileContent).toString('base64');

    

    // ගොනුව update කිරීමට එහි sha එක අවශ්‍යයි, මුලින්ම ගොනුව තිබේදැයි බලමු

    let sha = null;

    try {

        const { data } = await octokit.rest.repos.getContent({

            owner: GITHUB_OWNER,

            repo: GITHUB_REPO,

            path: githubFilePath,

        });

        sha = data.sha;

    } catch (error) {

        // ගොනුව නොතිබුණොත්, අලුතින් සාදනු ඇත (sha = null)

        console.log(`File not found on GitHub, creating new: ${githubFilePath}`);

    }



    // ගොනුව Create හෝ Update කිරීම

    const { data: uploadResult } = await octokit.rest.repos.createOrUpdateFileContents({

        owner: GITHUB_OWNER,

        repo: GITHUB_REPO,

        path: githubFilePath,

        message: commitMessage,

        content: contentBase64,

        sha: sha, // අලුතින් සාදන්නේ නම්, මෙය null වේ

        committer: {

            name: 'Quantum-MD Bot',

            email: 'bot@example.com', // ඔබට අවශ්‍ය පරිදි වෙනස් කරන්න

        },

    });



    // ගොනුවේ නම (Session ID ලෙස) ආපසු ලබා දීම

    return githubFilePath.split('/').pop().replace('.json', '');

}



router.get('/', async (req, res) => {

    // Session ID ලෙස භාවිතා කිරීමට අහඹු නමක්

    const id = makeid();

    let num = req.query.number;

    

    // GitHub path එකට ෆයිල් එකේ නම එකතු කිරීම.

    const githubSessionFileName = `${id}.json`;

    const githubFilePath = `${GITHUB_PATH}/${githubSessionFileName}`;



    async function GIFTED_MD_PAIR_CODE() {

        // temp ෆෝල්ඩරයේ session id එක සහිත ෆෝල්ඩරයක් සාදයි

        const {

            state,

            saveCreds

        } = await useMultiFileAuthState('./temp/' + id);

        

        try {

            var items = ["Safari"];

            function selectRandomItem(array) {

                var randomIndex = Math.floor(Math.random() * array.length);

                return array[randomIndex];

            }

            var randomItem = selectRandomItem(items);

            

            let sock = makeWASocket({

                auth: {

                    creds: state.creds,

                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),

                },

                printQRInTerminal: false,

                generateHighQualityLinkPreview: true,

                logger: pino({ level: "fatal" }).child({ level: "fatal" }),

                syncFullHistory: false,

                browser: Browsers.macOS(randomItem)

            });

            

            if (!sock.authState.creds.registered) {

                await delay(1500);

                num = num.replace(/[^0-9]/g, '');

                const code = await sock.requestPairingCode(num);

                if (!res.headersSent) {

                    await res.send({ code });

                }

            }

            

            sock.ev.on('creds.update', saveCreds);

            

            sock.ev.on("connection.update", async (s) => {

                const {

                    connection,

                    lastDisconnect

                } = s;

                

                if (connection == "open") {

                    await delay(5000);

                    

                    const localCredsPath = __dirname + `/temp/${id}/creds.json`;

                    

                    try {

                        // GitHub වෙත ගොනුව උඩුගත කිරීම

                        const sessionFileId = await uploadToGitHub(

                            localCredsPath,

                            githubFilePath,

                            `Quantum-MD Session: ${sock.user.id}`

                        );

                        

                        // GitHub path එකේ ගොනුවේ නම Session ID එක ලෙස යැවීම

                        let md = "VISPER-MD&" + sessionFileId;

                        

                        let code = await sock.sendMessage(sock.user.id, { text: md });

                        

                        let desc = `*⚠️ Dont share this code with anyone*

*⦁ Github :*  _https://github.com/THEMISADAS2007_
 
*⦁ Follow us :* _https://whatsapp.com/channel/0029Vb1Db0LCsU9SUsOXuC3c_

*⦁ Beta test :* _https://chat.whatsapp.com/Gf78Kc7H1C2AQtya0awEtj?mode=ems_copy_t_

> © 𝚅𝙸𝚂𝙿𝙴𝚁 𝙼𝙳`;

                        

                        await sock.sendMessage(sock.user.id, {

                            text: desc,

                            contextInfo: {

                                externalAdReply: {

                                    title: "VISPER-MD",

                                    thumbnailUrl: "https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg",

                                    sourceUrl: "https://whatsapp.com/channel/0029Vb1Db0LCsU9SUsOXuC3c",

                                    mediaType: 1,

                                    renderLargerThumbnail: true

                                }

                            }

                        }, { quoted: code });



                    } catch (e) {

                        console.error("GitHub Upload Error:", e);

                        

                        // Error එකක් ආවොත්, Session ID එක ලෙස 'failed' යැවිය හැක, නැතිනම් log එකක් පමණක් තැබිය හැක

                        let md = "VISPER-MD&upload_failed"; 

                        let ddd = await sock.sendMessage(sock.user.id, { text: md });

                        

                        let desc = `*⚠️ Dont share this code with anyone*

*⦁ Github :*  _https://github.com/THEMISADAS2007_
 
*⦁ Follow us :* _https://whatsapp.com/channel/0029Vb1Db0LCsU9SUsOXuC3c_

*⦁ Beta test :* _https://chat.whatsapp.com/Gf78Kc7H1C2AQtya0awEtj?mode=ems_copy_t_

> © 𝚅𝙸𝚂𝙿𝙴𝚁 𝙼𝙳`;

                        

                        await sock.sendMessage(sock.user.id, {

                            text: desc,

                            contextInfo: {

                                externalAdReply: {

                                    title: "VISPER-MD",

                                    thumbnailUrl: "https://mv-visper-full-db.pages.dev/Data/visper_main.jpeg",

                                    sourceUrl: "https://whatsapp.com/channel/0029Vb1Db0LCsU9SUsOXuC3c",

                                    mediaType: 1,

                                    renderLargerThumbnail: true

                                }

                            }

                        }, { quoted: ddd });

                    }

                    

                    await delay(10);

                    await sock.ws.close();

                    await removeFile('./temp/' + id);

                    console.log(`👤 ${sock.user.id} 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 ✅ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...`);

                    await delay(10);

                    process.exit();

                    

                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {

                    await delay(10);

                    GIFTED_MD_PAIR_CODE();

                }

            });

            

        } catch (err) {

            console.log("service restated:", err);

            await removeFile('./temp/' + id);

            if (!res.headersSent) {

                await res.send({ code: "❗ Service Unavailable" });

            }

        }

    }

    

    return await GIFTED_MD_PAIR_CODE();

});



/*

setInterval(() => {

    console.log("☘️ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗽𝗿𝗼𝗰𝗲𝘀𝘀...");

    process.exit();

}, 180000); //30min

*/



module.exports = router;
