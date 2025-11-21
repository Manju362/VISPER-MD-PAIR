const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver'); // npm i archiver

// GitHub API සඳහා Octokit
const { Octokit } = require('@octokit/rest');
let router = express.Router();
const pino = require("pino");

const botRepoUrl = "https://github.com/tharusha-md2008";
const Wachannellink = "https://whatsapp.com/channel/0029Vb9LTRHInlqISdCfln45";

const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, getAggregateVotesInPollMessage, DisconnectReason, WA_DEFAULT_EPHEMERAL, jidNormalizedUser, proto, getDevice, generateWAMessageFromContent, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys')

// GitHub Token එක Environment Variables වලින් ලබා ගැනීම (ඔයාගේ valid token දාන්න!)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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'; 
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
 * GitHub API භාවිතා කරමින් full session folder එක zip කරලා උඩුගත කිරීම
 * @param {string} sessionDir - Session folder path (e.g., './temp/id')
 * @param {string} githubFilePath - GitHub file path (e.g., 'sessions/id.zip')
 * @param {string} commitMessage - Commit message
 * @returns {Promise<string>} - Session ID
 */
async function uploadSessionToGitHub(sessionDir, githubFilePath, commitMessage) {
    try {
        // Zip create කරමු
        const archive = archiver('zip', { zlib: { level: 9 } });
        const output = fs.createWriteStream(`${sessionDir}.zip`);
        const promise = new Promise((resolve, reject) => {
            output.on('close', resolve);
            archive.on('error', reject);
        });
        archive.pipe(output);
        archive.directory(sessionDir, false);
        archive.finalize();
        await promise;

        // Zip content base64
        const zipPath = `${sessionDir}.zip`;
        const fileContent = fs.readFileSync(zipPath);
        const contentBase64 = Buffer.from(fileContent).toString('base64');

        // Existing file sha check
        let sha = null;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: githubFilePath,
            });
            sha = data.sha;
        } catch (error) {
            console.log(`File not found on GitHub, creating new: ${githubFilePath}`);
        }

        // Upload zip
        const { data: uploadResult } = await octokit.rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: githubFilePath,
            message: commitMessage,
            content: contentBase64,
            sha: sha,
            committer: {
                name: 'VISPER-MD Bot',
                email: 'bot@example.com',
            },
        });

        // Zip delete
        fs.unlinkSync(zipPath);

        // Session ID return (filename without .zip)
        return githubFilePath.split('/').pop().replace('.zip', '');
    } catch (error) {
        console.error("GitHub Upload Error:", error);
        throw error; // Rethrow to handle in caller
    }
}

router.get('/', async (req, res) => {
    // Session ID ලෙස භාවිතා කිරීමට අහඹු නමක්
    const id = makeid();
    let num = req.query.number;
    
    // GitHub path එකට zip file name එකතු කිරීම.
    const githubSessionFileName = `${id}.zip`;
    const githubFilePath = `${GITHUB_PATH}/${githubSessionFileName}`;

    async function GIFTED_MD_PAIR_CODE() {
        // temp folder එකේ session id එක සහිත folder එක සාදයි
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
                    
                    const sessionDir = path.join(__dirname, `/temp/${id}`);
                    
                    try {
                        // Full session GitHub වෙත upload කිරීම (zip as)
                        const sessionFileId = await uploadSessionToGitHub(
                            sessionDir,
                            githubFilePath,
                            `VISPER-MD Session: ${sock.user.id}`
                        );
                        
                        let md = "VISPER-MD&" + sessionFileId;
                        
                        let codeMsg = await sock.sendMessage(sock.user.id, { text: md });
                        
                        let desc = `*⚠️ Dont share this code with anyone*

*⦁ Github :*  _https://github.com/THEMISADAS2007_

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
                        }, { quoted: codeMsg });

                        // Message deliver වෙන්න extra delay
                        await delay(7000); // Increased to 7s

                    } catch (e) {
                        console.error("GitHub Upload Error:", e);
                        
                        // Upload fail උනත් local ID send කරමු
                        let sessionFileId = id;
                        let md = "VISPER-MD&" + sessionFileId + " (Upload failed - local only)";
                        
                        let codeMsg = await sock.sendMessage(sock.user.id, { text: md });
                        
                        let desc = `*⚠️ Dont share this code with anyone* (Upload failed, session local only)

*⦁ Github :*  _https://github.com/THEMISADAS2007_

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
                        }, { quoted: codeMsg });

                        await delay(7000);
                    }
                    
                    // Close and clean (no process.exit!)
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Session handled.`);
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    GIFTED_MD_PAIR_CODE();
                }
            });
            
        } catch (err) {
            console.log("service restarted:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "❗ Service Unavailable" });
            }
        }
    }
    
    return await GIFTED_MD_PAIR_CODE();
});

// Optional auto-restart (comment out if not needed)
setInterval(() => {
    console.log("☘️ Restarting process...");
    process.exit(0);
}, 180000); // 3min

module.exports = router;
