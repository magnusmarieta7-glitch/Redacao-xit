// ================================================================
// PAINEL STEIN WORLD - ESP + TELEPORT + SPEED
// Versão adaptável - (c) 2026
// ================================================================

(function() {
    'use strict';

    // =============================================================
    // 🔧 CONFIGURAÇÕES - AJUSTE AQUI DE ACORDO COM O JOGO
    // =============================================================
    const CONFIG = {
        // Senha
        password: 'hack123',

        // Títulos
        panelTitle: '🎮 Stein World',
        panelSubtitle: 'ESP + Automação',

        // Velocidades (em unidades do jogo por tick ou por segundo)
        // Você precisa descobrir como o jogo controla a velocidade
        speeds: {
            normal: 1.0,
            rapido: 2.5,
            flash: 5.0
        },

        // -------- ONDE PEGAR OS DADOS DO JOGADOR --------
        // Funções que retornam os dados atuais do jogador
        // Exemplo: window.player, window.game.player, etc.
        getPlayerData: function() {
            // 🔁 SUBSTITUA pelos objetos reais do jogo
            // Exemplo: return window.player || null;
            // Se o jogo usar window.game.player, faça:
            // return window.game ? window.game.player : null;
            return null; // <--- VOCÊ VAI MUDAR AQUI
        },

        // -------- ONDE PEGAR A LISTA DE JOGADORES --------
        getPlayersList: function() {
            // 🔁 SUBSTITUA pelo array de jogadores do jogo
            // Exemplo: return window.players || [];
            // Se for window.game.players, use:
            // return window.game ? window.game.players : [];
            return []; // <--- VOCÊ VAI MUDAR AQUI
        },

        // -------- FUNÇÃO DE TELEPORTE --------
        // Deve receber as coordenadas ou o ID do jogador e executar o comando
        teleportTo: function(target) {
            // 🔁 SUBSTITUA pela ação real de teleporte
            // Exemplo: if (window.game && window.game.teleport) window.game.teleport(target);
            // Ou se for um comando de chat: window.socket.emit('tp', target);
            console.log('🔁 Teleportar para:', target);
            alert('Funcionalidade de teleporte não configurada. Ajuste a função "teleportTo" no código.');
        },

        // -------- FUNÇÃO PARA ALTERAR VELOCIDADE --------
        setSpeed: function(speedMultiplier) {
            // 🔁 SUBSTITUA pela lógica real que altera a velocidade do jogador
            // Exemplo: if (window.player) window.player.speed = speedMultiplier;
            console.log('⚡ Velocidade alterada para:', speedMultiplier);
        }
    };
    // =============================================================


    // ---------- ESTILOS CSS (mesmo do painel anterior, com algumas cores) ----------
    const style = document.createElement('style');
    style.textContent = `
        /* ---- Overlay de senha (igual ao anterior) ---- */
        #pwdOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.3s;
        }
        #pwdOverlay.hidden { opacity: 0; pointer-events: none; }
        .pwd-box {
            background: #1e1e2f;
            padding: 40px 50px;
            border-radius: 20px;
            border: 1px solid #00ff88;
            box-shadow: 0 0 40px rgba(0,255,136,0.2);
            text-align: center;
            max-width: 400px;
            width: 90%;
            color: #fff;
        }
        .pwd-box h1 { color: #00ff88; font-weight: 600; font-size: 1.8rem; margin-bottom: 8px; }
        .pwd-box p { color: #aaa; margin-bottom: 25px; font-size: 0.9rem; }
        .pwd-box input {
            width: 100%;
            padding: 14px 18px;
            border-radius: 12px;
            border: 1px solid #444;
            background: #2a2a3a;
            color: #fff;
            font-size: 1rem;
            outline: none;
            text-align: center;
            letter-spacing: 4px;
        }
        .pwd-box input:focus { border-color: #00ff88; box-shadow: 0 0 15px rgba(0,255,136,0.15); }
        .pwd-box button {
            margin-top: 20px;
            width: 100%;
            padding: 14px;
            background: #00ff88;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.1rem;
            color: #0b0b15;
            cursor: pointer;
            transition: 0.2s;
        }
        .pwd-box button:hover { background: #00cc6a; transform: scale(1.02); }
        .pwd-box .err-msg { color: #ff4757; font-size: 0.85rem; margin-top: 12px; min-height: 20px; }

        /* ---- Painel principal (personalizado) ---- */
        #hackPanel {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 480px;
            max-width: calc(100vw - 40px);
            max-height: 90vh;
            background: #0d0d1a;
            border-radius: 18px;
            border: 1px solid #2a2a50;
            box-shadow: 0 15px 50px rgba(0,0,0,0.9);
            z-index: 99998;
            display: none;
            backdrop-filter: blur(4px);
            color: #e0e0e0;
            font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
            overflow-y: auto;
        }
        #hackPanel.active { display: block; }

        #panelHeader {
            padding: 14px 20px;
            background: #1a1a30;
            border-radius: 18px 18px 0 0;
            border-bottom: 1px solid #2a2a50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }
        #panelHeader:active { cursor: grabbing; }
        #panelHeader h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #ffaa00;
            letter-spacing: 1px;
            margin: 0;
        }
        #panelHeader h2 small { font-weight: 400; font-size: 0.7rem; color: #888; margin-left: 8px; }
        .header-actions { display: flex; gap: 10px; }
        .header-actions button {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0 4px;
            transition: 0.2s;
        }
        .header-actions button:hover { color: #fff; }
        .header-actions #closePanelBtn { color: #ff4757; }
        .header-actions #closePanelBtn:hover { color: #ff6b81; }

        #panelBody {
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        #panelBody label {
            font-size: 0.8rem;
            font-weight: 500;
            color: #aaa;
            display: block;
            margin-bottom: 4px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 20px;
            background: #12121f;
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid #1e1e34;
            font-size: 0.85rem;
        }
        .info-grid .label { color: #888; }
        .info-grid .value { color: #ffaa00; font-weight: 600; text-align: right; }

        #playersList {
            background: #12121f;
            border-radius: 12px;
            border: 1px solid #1e1e34;
            padding: 6px 0;
            max-height: 180px;
            overflow-y: auto;
        }
        #playersList .player-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 14px;
            border-bottom: 1px solid #1a1a2e;
            font-size: 0.85rem;
        }
        #playersList .player-item:last-child { border-bottom: none; }
        #playersList .player-name { color: #ddd; }
        #playersList .player-level { color: #66ccff; font-size: 0.75rem; margin: 0 8px; }
        #playersList .player-dist { color: #ffaa00; font-weight: 600; }
        #playersList .player-item .tp-btn {
            background: #2a2a50;
            border: none;
            color: #fff;
            border-radius: 30px;
            padding: 2px 12px;
            font-size: 0.7rem;
            cursor: pointer;
            transition: 0.2s;
        }
        #playersList .player-item .tp-btn:hover { background: #3d3d6a; }

        .speed-group {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            background: #12121f;
            padding: 10px 14px;
            border-radius: 12px;
            border: 1px solid #1e1e34;
            align-items: center;
        }
        .speed-group label { margin-bottom: 0; color: #ccc; font-size: 0.85rem; }
        .speed-group .radio-option {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            color: #bbb;
            font-size: 0.85rem;
        }
        .speed-group .radio-option input[type="radio"] { accent-color: #ffaa00; width: 16px; height: 16px; cursor: pointer; }
        .speed-group .radio-option input[type="radio"]:checked + span { color: #ffaa00; font-weight: 600; }

        .action-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .action-buttons button {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 30px;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.2s;
            min-width: 70px;
        }
        #refreshBtn { background: #2a2a50; color: #fff; }
        #refreshBtn:hover { background: #3d3d6a; }

        .status-bar {
            font-size: 0.75rem;
            color: #555;
            text-align: right;
            border-top: 1px solid #1e1e2e;
            padding-top: 10px;
            margin-top: 4px;
        }
        .status-bar #statusText { color: #777; }
        .status-bar #statusText.typing { color: #ffaa00; }

        #reopenFloater {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #ffaa00;
            border-radius: 50%;
            border: none;
            box-shadow: 0 4px 20px rgba(255,170,0,0.3);
            color: #0b0b15;
            font-size: 1.8rem;
            font-weight: 700;
            cursor: pointer;
            z-index: 99997;
            display: none;
            transition: 0.2s;
            align-items: center;
            justify-content: center;
        }
        #reopenFloater:hover { transform: scale(1.1); background: #e69900; }
        #reopenFloater.show { display: flex; }

        @media (max-width: 500px) {
            #hackPanel { right: 10px; bottom: 10px; width: calc(100vw - 20px); border-radius: 14px; }
            #panelBody { padding: 14px; }
            .pwd-box { padding: 30px 25px; }
            .info-grid { grid-template-columns: 1fr; }
            .action-buttons button { flex: 1 1 100%; }
        }
    `;
    document.head.appendChild(style);

    // ---------- CRIAÇÃO DOS ELEMENTOS HTML ----------
    // Overlay de senha
    const overlay = document.createElement('div');
    overlay.id = 'pwdOverlay';
    overlay.innerHTML = `
        <div class="pwd-box">
            <h1>🔐 ${CONFIG.panelTitle}</h1>
            <p>${CONFIG.panelSubtitle} • Acesso restrito</p>
            <input type="password" id="pwdInput" placeholder="Digite a senha" autofocus>
            <button id="pwdBtn">Acessar Painel</button>
            <div class="err-msg" id="pwdError"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Painel principal
    const panel = document.createElement('div');
    panel.id = 'hackPanel';
    panel.innerHTML = `
        <div id="panelHeader">
            <h2>${CONFIG.panelTitle} <small>${CONFIG.panelSubtitle}</small></h2>
            <div class="header-actions">
                <button id="minimizePanelBtn" title="Minimizar">─</button>
                <button id="closePanelBtn" title="Fechar painel">✕</button>
            </div>
        </div>
        <div id="panelBody">
            <!-- Informações do jogador -->
            <div>
                <label>📊 Seus dados</label>
                <div class="info-grid" id="playerInfo">
                    <span class="label">Nome:</span><span class="value" id="pName">-</span>
                    <span class="label">Level:</span><span class="value" id="pLevel">-</span>
                    <span class="label">Posição:</span><span class="value" id="pPos">-</span>
                    <span class="label">Bioma:</span><span class="value" id="pBiome">-</span>
                </div>
            </div>

            <!-- Lista de jogadores -->
            <div>
                <label>👥 Jogadores próximos</label>
                <div id="playersList">
                    <div style="padding:10px 14px; color:#888; font-size:0.8rem;">Nenhum jogador encontrado</div>
                </div>
            </div>

            <!-- Velocidade -->
            <div class="speed-group">
                <label>⚡ Velocidade:</label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="normal" checked> <span>Normal</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="rapido"> <span>Rápido</span>
                </label>
                <label class="radio-option">
                    <input type="radio" name="speed" value="flash"> <span>Flash</span>
                </label>
            </div>

            <!-- Ações -->
            <div class="action-buttons">
                <button id="refreshBtn">🔄 Atualizar</button>
                <button id="tpToNearestBtn">📡 TP para o mais próximo</button>
            </div>

            <!-- Status -->
            <div class="status-bar">
                Status: <span id="statusText">Aguardando...</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // Botão flutuante
    const floater = document.createElement('button');
    floater.id = 'reopenFloater';
    floater.textContent = '🎮';
    floater.title = 'Abrir Painel';
    document.body.appendChild(floater);

    // ---------- REFERÊNCIAS ----------
    const pwdOverlay = document.getElementById('pwdOverlay');
    const pwdInput = document.getElementById('pwdInput');
    const pwdBtn = document.getElementById('pwdBtn');
    const pwdError = document.getElementById('pwdError');

    const panelEl = document.getElementById('hackPanel');
    const panelHeader = document.getElementById('panelHeader');
    const closeBtn = document.getElementById('closePanelBtn');
    const minimizeBtn = document.getElementById('minimizePanelBtn');
    const floaterEl = document.getElementById('reopenFloater');

    const pName = document.getElementById('pName');
    const pLevel = document.getElementById('pLevel');
    const pPos = document.getElementById('pPos');
    const pBiome = document.getElementById('pBiome');
    const playersListEl = document.getElementById('playersList');
    const refreshBtn = document.getElementById('refreshBtn');
    const tpNearestBtn = document.getElementById('tpToNearestBtn');
    const statusText = document.getElementById('statusText');

    let currentSpeed = 'normal';
    let targetPlayers = [];

    // ---------- FUNÇÕES DE STATUS ----------
    function setStatus(msg, type = '') {
        statusText.textContent = msg;
        statusText.className = type;
    }

    // ---------- FUNÇÃO PARA ATUALIZAR INFORMAÇÕES ----------
    function refreshData() {
        try {
            const player = CONFIG.getPlayerData();
            const players = CONFIG.getPlayersList();

            if (player) {
                pName.textContent = player.name || player.nick || 'Desconhecido';
                pLevel.textContent = player.level || player.lvl || '?';
                // Coordenadas - ajuste os campos conforme o jogo
                const x = player.x || player.posX || player.coordX || 0;
                const y = player.y || player.posY || player.coordY || 0;
                const z = player.z || player.posZ || player.coordZ || 0;
                pPos.textContent = `X:${x} Y:${y} Z:${z}`;
                pBiome.textContent = player.biome || player.area || 'Desconhecido';
            } else {
                pName.textContent = '⚠️ Não conectado';
                pLevel.textContent = '-';
                pPos.textContent = '-';
                pBiome.textContent = '-';
            }

            // Lista de jogadores
            if (players && players.length > 0) {
                targetPlayers = players;
                let html = '';
                players.forEach(p => {
                    const dist = p.distance || p.dist || '?';
                    const name = p.name || p.nick || 'Anônimo';
                    const level = p.level || p.lvl || '?';
                    html += `
                        <div class="player-item">
                            <span class="player-name">${name}</span>
                            <span class="player-level">Lv.${level}</span>
                            <span class="player-dist">${dist}m</span>
                            <button class="tp-btn" data-player="${name}">TP</button>
                        </div>
                    `;
                });
                playersListEl.innerHTML = html;

                // Adiciona eventos de TP para cada botão
                playersListEl.querySelectorAll('.tp-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const playerName = this.dataset.player;
                        CONFIG.teleportTo(playerName);
                        setStatus(`📡 Teleportando para ${playerName}...`, 'typing');
                    });
                });

                // Botão TP para o mais próximo
                tpNearestBtn.onclick = function() {
                    if (targetPlayers.length === 0) return;
                    // encontra o mais próximo (menor distância)
                    let nearest = targetPlayers.reduce((a, b) => {
                        const da = parseFloat(a.distance || a.dist || 999999);
                        const db = parseFloat(b.distance || b.dist || 999999);
                        return da < db ? a : b;
                    });
                    const name = nearest.name || nearest.nick;
                    CONFIG.teleportTo(name);
                    setStatus(`📡 Teleportando para ${name} (mais próximo)...`, 'typing');
                };

            } else {
                playersListEl.innerHTML = `<div style="padding:10px 14px; color:#888; font-size:0.8rem;">Nenhum jogador visível</div>`;
                tpNearestBtn.onclick = null;
            }

            setStatus('✅ Atualizado', '');
        } catch (e) {
            console.error('Erro ao atualizar:', e);
            setStatus('❌ Erro ao buscar dados', 'stopped');
        }
    }

    // ---------- CONTROLE DE VELOCIDADE ----------
    document.querySelectorAll('input[name="speed"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                currentSpeed = this.value;
                const multiplier = CONFIG.speeds[currentSpeed] || 1.0;
                CONFIG.setSpeed(multiplier);
                setStatus(`⚡ Velocidade: ${currentSpeed.toUpperCase()} (${multiplier}x)`, 'typing');
            }
        });
    });

    // ---------- SENHA ----------
    function checkPassword() {
        const pass = pwdInput.value.trim();
        if (pass === CONFIG.password) {
            pwdOverlay.classList.add('hidden');
            panelEl.classList.add('active');
            floaterEl.classList.remove('show');
            pwdError.textContent = '';
            pwdInput.value = '';
            setStatus('Painel ativo');
            refreshData(); // primeira atualização
            // Atualiza a cada 3 segundos
            if (window.steinInterval) clearInterval(window.steinInterval);
            window.steinInterval = setInterval(refreshData, 3000);
        } else {
            pwdError.textContent = '❌ Senha incorreta.';
            pwdInput.value = '';
            pwdInput.focus();
        }
    }

    pwdBtn.addEventListener('click', checkPassword);
    pwdInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkPassword(); });

    // ---------- FECHAR / REABRIR ----------
    function closePanel() {
        panelEl.classList.remove('active');
        if (window.steinInterval) clearInterval(window.steinInterval);
        floaterEl.classList.add('show');
        setStatus('Painel fechado');
    }

    closeBtn.addEventListener('click', closePanel);
    floaterEl.addEventListener('click', function() {
        pwdOverlay.classList.remove('hidden');
        floaterEl.classList.remove('show');
        panelEl.classList.remove('active');
        pwdInput.value = '';
        pwdInput.focus();
        pwdError.textContent = '';
    });

    // ---------- MINIMIZAR ----------
    let isPanelMinimized = false;
    minimizeBtn.addEventListener('click', function() {
        const body = document.getElementById('panelBody');
        if (isPanelMinimized) {
            body.style.display = 'flex';
            minimizeBtn.textContent = '─';
            isPanelMinimized = false;
        } else {
            body.style.display = 'none';
            minimizeBtn.textContent = '⬜';
            isPanelMinimized = true;
        }
    });

    // ---------- ARRASTAR (igual ao anterior) ----------
    let isDragging = false;
    let dragOffsetX = 0, dragOffsetY = 0;
    panelHeader.addEventListener('mousedown', function(e) {
        if (e.target.closest('button')) return;
        isDragging = true;
        const rect = panelEl.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        panelEl.style.cursor = 'grabbing';
    });

    function onDragMove(e) {
        if (!isDragging) return;
        let left = e.clientX - dragOffsetX;
        let top = e.clientY - dragOffsetY;
        left = Math.max(0, Math.min(window.innerWidth - panelEl.offsetWidth, left));
        top = Math.max(0, Math.min(window.innerHeight - panelEl.offsetHeight, top));
        panelEl.style.left = left + 'px';
        panelEl.style.top = top + 'px';
        panelEl.style.right = 'auto';
        panelEl.style.bottom = 'auto';
    }

    function onDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        panelEl.style.cursor = '';
    }

    // ---------- BOTÃO REFRESH MANUAL ----------
    refreshBtn.addEventListener('click', refreshData);

    // ---------- INICIALIZAÇÃO ----------
    setStatus('Aguardando senha');
    pwdInput.focus();
    console.log('🎮 Painel Stein World carregado. Ajuste as funções no CONFIG para conectar ao jogo.');
})();
