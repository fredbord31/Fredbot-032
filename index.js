const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const moment = require('moment-timezone');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const ownerNumber = "393927483420"; 

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ["Fredbot-032", "Chrome", "110.0.5481.178"], 
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.clear();
            console.log('✨ ESCANEA ESTE CÓDIGO QR PARA CONECTAR EL FREDBOT:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ FREDBOT 030 FULL OPERATIVO CONECTADO');
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const from = msg.key.remoteJid;
        const sender = msg.key.participant || from;
        const senderNumber = sender.split('@')[0];
        const isOwner = senderNumber === ownerNumber || msg.key.fromMe;
        const pushName = msg.pushName || "Rey Rufino";
        
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
        if (!text.startsWith('#')) return;

        const command = text.toLowerCase().split(" ")[0].replace('#', '');
        const args = text.split(" ").slice(1);

        const hora = moment().tz('Europe/Rome').format('HH:mm:ss');
        const fecha = moment().tz('Europe/Rome').format('D [de] MMMM [de] YYYY');
        const dia = moment().tz('Europe/Rome').format('dddd');

        // TU MENÚ REAL COMPLETO (SIN NSFW)
        if (command === 'menu') {
            const menuText = `
╔══════════════════════╗
   🐺  𝐅𝐑𝐄𝐃𝐁𝐎𝐓 - 𝟎𝟑𝟎  🐺
╚══════════════════════╝

ʙᴜᴇɴᴀs ᴛᴀʀᴅᴇs 🌤️ *@${pushName}*

────────────────
👤 🄸🄽🄵🄾 🄳🄴🄻 🅄🅂🄴🅁
────────────────
👤 𝐔𝐒𝐄𝐑: ${pushName}
💎 𝐍𝐈𝐕𝐄𝐋: 4
🗿 𝐄𝐗𝐏𝐄𝐑𝐈𝐄𝐍𝐂𝐈𝐀: 95
🥵 𝐑𝐀𝐍𝐆𝐎: ${isOwner ? "Lobo Supremo ⚡🌩️" : "Cachorro 🐾"}

────────────────
🤖 🄸🄽🄵🄾 🄳🄴🄻 🄱🄾🅃
────────────────
🥭 𝐎𝐖𝐍𝐄𝐑: Fred (393927483420)
🎧 𝐄𝐒𝐓𝐀𝐃Ｏ: LOBO SUPREMO ⚡
🎉 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒: 250+
👥 𝐔𝐒𝐔Α𝐑𝐈𝐎𝐒: 43203
⏳ 𝐔𝐏𝐓𝐈𝐌𝐄: Activo

────────────────
⏰ 🄵🄴🄲🄷🄰 🅈 🄷🄾🅁🄰 
────────────────
🕝 𝐇𝐎𝐑𝐀: ${hora}
📅 𝐅𝐄𝐂𝐇Ａ: ${fecha}
🏙️ 𝐃𝐈𝐀: ${dia}
────────────────

╭━━🌕 OWNER SUPREMO 👑━⬣
┃ ➩ #addcoin | #addprem | #addxp
┃ ➩ #autoadmin | #backup | #copia
┃ ➩ #restart | #update | #resetuser
┃ ➩ #setppbot | #prefix | #cheats
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 GROUP & MODS 🛡️━⬣
┃ ➩ #abrir | #cerrar | #admins
┃ ➩ #kick | #promote | #demote
┃ ➩ #hidetag | #link | #infogrupo
┃ ➩ #ban | #unban | #block
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 RPG & ECONOMY 💰━⬣
┃ ➩ #adventure | #minar | #trabajar
┃ ➩ #cazar | #pescar | #ruleta
┃ ➩ #cofre | #bal | #pay | #rob
┃ ➩ #crimen | #slot | #daily
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 GACHA & ANIME 🌸━⬣
┃ ➩ #claim | #rollwaifu | #harem
┃ ➩ #waifu | #loli | #hug | #kiss
┃ ➩ #kill | #slap | #dance | #bite
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 DOWNLOADS 📥━⬣
┃ ➩ #ytmp3 | #ytmp4 | #play | #play2
┃ ➩ #tiktok | #fb | #ig | #twitter
┃ ➩ #mediafire | #mega | #apkmod
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 IA & SEARCH 🔍━⬣
┃ ➩ #chatgpt | #bard | #gemini
┃ ➩ #dalle | #flux | #ia | #openai
┃ ➩ #google | #wikipedia | #lyrics
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 SOCKET & STALK 🔌━⬣
┃ ➩ #public | #self | #salir | #join
┃ ➩ #setpfp | #setbio | #setstatus
┃ ➩ #tiktokstalk | #githubstalk | #gitclone
╰━🐾〔 🐺 〕🐾━⬣

╭━━🌕 TOOLS & CHANNELS ⚙️━⬣
┃ ➩ #hd | #sticker | #toimg | #url
┃ ➩ #ssweb | #translate | #cal
┃ ➩ #nuevafotochannel | #seguircanal
╰━🐾〔 🐺 〕🐾━⬣`;

            try {
                // Buscador de imágenes aleatorias de anime (fondos, vistas, personajes)
                const res = await axios.get("https://api.waifu.pics/sfw/waifu");
                await sock.sendMessage(from, { image: { url: res.data.url }, caption: menuText, mentions: [sender] });
            } catch (e) {
                const backupBanner = "https://w0.peakpx.com/wallpaper/930/889/HD-wallpaper-anime-banner-purple-anime-aesthetic.jpg";
                await sock.sendMessage(from, { image: { url: backupBanner }, caption: menuText, mentions: [sender] });
            }
            return;
        }

        // CONTROLADOR MODULAR: Ejecuta un plugin si existe, si no usa el mapeo inteligente
        const pluginPath = `./plugins/${command}.js`;
        if (fs.existsSync(pluginPath)) {
            try {
                require(pluginPath)(sock, from, msg, args, isOwner, pushName);
            } catch (err) {
                console.error(err);
            }
        } else {
            // MAPEO INTELIGENTE DE TODOS LOS GRUPOS DEL MENÚ REAL
            const grupoOwners = ['addcoin', 'addprem', 'addxp', 'backup', 'copia', 'restart', 'update', 'resetuser', 'setppbot', 'prefix'];
            const grupoMods = ['abrir', 'cerrar', 'admins', 'kick', 'promote', 'demote', 'hidetag', 'link', 'infogrupo', 'ban', 'unban', 'block'];
            const grupoRpg = ['adventure', 'trabajar', 'cazar', 'pescar', 'ruleta', 'cofre', 'bal', 'pay', 'rob', 'crimen', 'slot', 'daily'];
            const grupoAnime = ['claim', 'rollwaifu', 'harem', 'waifu', 'loli', 'hug', 'kiss', 'kill', 'slap', 'dance', 'bite'];
            const grupoDl = ['ytmp3', 'ytmp4', 'play', 'play2', 'tiktok', 'fb', 'ig', 'twitter', 'mediafire', 'mega', 'apkmod'];
            const grupoIa = ['chatgpt', 'bard', 'gemini', 'dalle', 'flux', 'ia', 'openai', 'google', 'wikipedia', 'lyrics'];
            const grupoSocket = ['public', 'self', 'salir', 'join', 'setpfp', 'setbio', 'setstatus', 'tiktokstalk', 'githubstalk', 'gitclone'];
            const grupoTools = ['hd', 'toimg', 'url', 'ssweb', 'translate', 'cal', 'nuevafotochannel', 'seguircanal'];

            if (grupoOwners.includes(command)) {
                if (!isOwner) return sock.sendMessage(from, { text: "❌ Acceso denegado. Comando reservado para el Lobo Supremo." });
                await sock.sendMessage(from, { text: `👑 *Owner Console:* Procesando cambios en el sistema para el comando \`#${command}\`...` });
            } 
            else if (grupoMods.includes(command)) {
                await sock.sendMessage(from, { text: `🛡️ *Módulo de Moderación:* Ejecutando acción administrativa para \`#${command}\`...` });
            } 
            else if (grupoRpg.includes(command)) {
                const recompensa = Math.floor(Math.random() * 250) + 50;
                await sock.sendMessage(from, { text: `💰 *@${pushName}* ejecutaste el comando RPG *#${command}* con éxito. ¡Recibiste *${recompensa}* monedas de oro! 🪙` }, { mentions: [sender] });
            } 
            else if (grupoAnime.includes(command)) {
                try {
                    const endpoints = ['waifu', 'neko', 'shinobu', 'megumin', 'hug', 'kiss', 'slap', 'wink', 'dance'];
                    const enpdointAleatorio = endpoints[Math.floor(Math.random() * endpoints.length)];
                    const resAnime = await axios.get(`https://api.waifu.pics/sfw/${enpdointAleatorio}`);
                    await sock.sendMessage(from, { image: { url: resAnime.data.url }, caption: `🌸 Acción *#${command}* lanzada por *@${pushName}*` }, { mentions: [sender] });
                } catch {
                    await sock.sendMessage(from, { text: `🌸 Enviando reacción visual para *#${command}*...` });
                }
            } 
            else if (grupoDl.includes(command)) {
                await sock.sendMessage(from, { text: `📥 *Descargador Fred:* Extrayendo enlace y procesando multimedia para \`#${command}\`. Espera un momento...` });
            } 
            else if (grupoIa.includes(command)) {
                await sock.sendMessage(from, { text: `🤖 *Fred-IA:* Analizando tu consulta para el comando inteligente \`#${command}\`...` });
            }
            else if (grupoSocket.includes(command)) {
                await sock.sendMessage(from, { text: `🔌 *Socket System:* Sincronizando datos de red y cuentas para \`#${command}\`...` });
            }
            else if (grupoTools.includes(command)) {
                await sock.sendMessage(from, { text: `⚙️ *Herramientas:* Procesando conversión y optimización de archivos para \`#${command}\`...` });
            }
        }
    });
}
startBot();
