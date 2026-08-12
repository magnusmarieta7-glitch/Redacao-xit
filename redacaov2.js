(function () {
    'use strict';
    const APP_ID = 'RedacaoBypass';
    const COOKIE_NAME = 'rb_gemini_key_v2';
    const REQUIRED_PATH = '/student-write-essay';
    // NOVOS DADOS CONFORME PEDIU
    const CREDIT_NAME = '@Xx_Dark_Scripts_xX';
    const CREDIT_LINK = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWYU4Hq0jJtsfJOqLG3CEXT2gv_12SWAjikANUSsUWMQ&s=10';

    // =================================================================
    // UTILITÁRIOS
    // =================================================================
    const Utils = {
        setCookie: (name, value, days = 365) => {
            const d = new Date();
            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
        },
        getCookie: (name) => {
            const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return v ? v[2] : null;
        },
        isTitleField: (element) => {
            if (!element) return false;
            if (element.tagName === 'INPUT' && element.type === 'text') {
                const parent = element.closest('.MuiFormControl-root');
                if (parent && parent.querySelector('label')?.textContent.includes('Título')) return true;
                if (element.getAttribute('maxlength') === '100') return true;
            }
            return false;
        },
        scrapeAssignmentData: () => {
            const getTextByLabel = (lbl) => {
                const all = Array.from(document.querySelectorAll('p.MuiTypography-root'));
                const node = all.find(p => p.textContent.trim() === lbl);
                if (node && node.nextElementSibling) return node.nextElementSibling.textContent.trim();
                if (node && node.parentElement) {
                     const siblings = Array.from(node.parentElement.children);
                     const idx = siblings.indexOf(node);
                     if (siblings[idx + 1]) return siblings[idx + 1].textContent.trim();
                }
                return null;
            };
            const getSection = (txt) => {
                const all = Array.from(document.querySelectorAll('p.MuiTypography-root'));
                const head = all.find(p => p.textContent.trim().includes(txt));
                if (!head) return '';
                let container = head.closest('.MuiBox-root');
                if (container && container.nextElementSibling) {
                    let next = container.nextElementSibling;
                    while(next && next.textContent.trim() === '') next = next.nextElementSibling;
                    if (next) return next.textContent.trim();
                }
                return '';
            };
            return {
                tema: getTextByLabel('Tema:') || 'Tema Livre',
                genero: getTextByLabel('Gênero:') || 'Dissertação',
                palavras: getTextByLabel('Número de palavras:') || '20 linhas',
                textoApoio: getSection('ENUNCIADO') + ' ' + getSection('TEXTO DE APOIO')
            };
        }
    };

    // =================================================================
    // ESTILOS — CORES NORMAIS/CLARAS (SEM FUNDO PRETO)
    // =================================================================
    const styleId = `${APP_ID}_styles`;
    document.getElementById(styleId)?.remove();
    const css = `
        :root {
            --bg: #ffffff; --surface: #f5f5f5; --border: #d0d0d0;
            --primary: #2563eb; --primary-hover: #1d4ed8;
            --text: #1f2937; --muted: #6b7280; --danger: #dc2626;
            --credit-color: #e11d48;
        }
        #${APP_ID}_overlay {
            position: fixed; top: 60px; left: 20px; z-index: 999999;
            font-family: Arial, sans-serif;
        }
        .rb-panel {
            background: var(--bg); color: var(--text);
            padding: 16px; border-radius: 12px; width: 320px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid var(--border);
            display: flex; flex-direction: column; gap: 12px;
        }
        .rb-header { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 8px; background: rgba(37,99,235,0.05); border-radius: 6px;
            cursor: move; user-select: none;
        }
        .rb-win-btn { 
            cursor: pointer; font-size: 18px; width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 6px; font-weight: bold;
        }
        .rb-btn-min { color: var(--muted); background: #e5e7eb; }
        .rb-btn-min:hover { background: #d1d5db; color: #000; }
        .rb-btn-close { color: var(--danger); background: rgba(220,38,38,0.1); }
        .rb-btn-close:hover { background: rgba(220,38,38,0.2); }
        .rb-title { font-size: 14px; font-weight: 700; color: var(--primary); text-transform: uppercase; }
        .rb-field-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 8px; }
        .rb-badge-title { background: #fbbf24; color: #000; }
        .rb-badge-body { background: var(--primary); color: #fff; }
        .rb-textarea, .rb-input {
            background: var(--surface); border: 1px solid var(--border); color: var(--text);
            border-radius: 6px; font-size: 13px; outline: none;
            width: 100%; box-sizing: border-box;
        }
        .rb-textarea { padding: 10px; height: 90px; resize: none; }
        .rb-input { padding: 8px; margin-bottom: 8px; }
        .rb-chips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .rb-chip {
            background: var(--surface); border: 1px solid var(--border); color: var(--muted);
            padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;
        }
        .rb-chip.active { background: var(--primary); color: white; border-color: var(--primary); }
        .rb-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .rb-btn {
            border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;
            display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .rb-btn-primary { background: var(--primary); color: white; }
        .rb-btn-primary:hover { background: var(--primary-hover); }
        .rb-btn-ai { width: 100%; background: #1d4ed8; color: white; margin-bottom: 4px; }
        .rb-btn-action { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
        .rb-progress-bar { height: 4px; background: var(--primary); width: 0%; transition: width 0.1s linear; border-radius: 2px; }
        .credit-btn {
            display: inline-block; margin-top: 6px; padding: 6px 12px;
            background: var(--credit-color); color: white !important; font-size: 12px; font-weight: bold;
            border-radius: 6px; text-decoration: none; text-align: center; transition: 0.2s;
        }
        .credit-btn:hover { opacity: 0.9; transform: scale(1.02); }
    `;
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // =================================================================
    // LÓGICA PRINCIPAL
    // =================================================================
    class RedacaoBypassEngine {
        constructor() {
            this.state = {
                target: null, isTargetTitle: false, text: '', speed: 40,
                isPaused: false, isTyping: false, index: 0, 
                apiKey: Utils.getCookie(COOKIE_NAME) || ''
            };
            this.ui = null; this.toastEl = null; this.highlighter = null;
            this.dragState = { isDragging: false };
            this.init();
        }
        async init() {
            if (!window.location.href.includes(REQUIRED_PATH)) {
                alert('Use na página de redação!');
                return;
            }
            this.createOverlay();
            this.enableSelectionMode();
        }
        createOverlay() {
            this.ui = document.createElement('div');
            this.ui.id = `${APP_ID}_overlay`;
            document.body.appendChild(this.ui);
            this.renderConfigPanel();
        }
        applyDrag(handle, container) {
            let startX, startY, initialLeft, initialTop;
            const onDown = (e) => {
                if (e.target.closest('.rb-win-btn, .credit-btn')) return;
                this.dragState.isDragging = true;
                const clientX = e.clientX;
                const clientY = e.clientY;
                startX = clientX;
                startY = clientY;
                const rect = container.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            };
            const onMove = (e) => {
                if (!this.dragState.isDragging) return;
                e.preventDefault();
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                container.style.left = `${initialLeft + dx}px`;
                container.style.top = `${initialTop + dy}px`;
            };
            const onUp = () => {
                this.dragState.isDragging = false;
            };
            handle.addEventListener('mousedown', onDown);
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        }
        renderConfigPanel() {
            if (!this.ui) return;
            this.ui.innerHTML = '';
            const panel = document.createElement('div');
            panel.className = 'rb-panel';
            const fieldBadge = this.state.isTargetTitle ? 
                `<span class="rb-field-badge rb-badge-title">TÍTULO</span>` : 
                `<span class="rb-field-badge rb-badge-body">REDAÇÃO</span>`;

            panel.innerHTML = `
                <div class="rb-header">
                    <div style="display:flex; align-items:center;">
                        <span class="rb-title">BYPASS</span> ${fieldBadge}
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button id="rb-close" class="rb-win-btn rb-btn-close">✕</button>
                    </div>
                </div>
                <div>
                    <input type="password" id="rb-api-key" class="rb-input" placeholder="Chave API Gemini" value="${this.state.apiKey}">
                    <button id="rb-generate-ai" class="rb-btn rb-btn-ai" style="width:100%; color:white;">Gerar com IA</button>
                </div>
                <textarea id="rb-input" class="rb-textarea" placeholder="Ou cole o texto aqui...">${this.state.text}</textarea>
                <div class="rb-chips-grid">
                    <div class="rb-chip" data-val="70">Lento</div>
                    <div class="rb-chip active" data-val="40">Normal</div>
                    <div class="rb-chip" data-val="15">Rápido</div>
                </div>
                <div class="rb-controls">
                    <button id="rb-start" class="rb-btn rb-btn-primary">✍️ Digitar</button>
                    <button id="rb-select-new" class="rb-btn rb-btn-action">📌 Trocar campo</button>
                </div>
                <div id="rb-running-controls" style="display:none; grid-template-columns:1fr 1fr; gap:8px;">
                    <button id="rb-pause" class="rb-btn rb-btn-action">⏸️ Pausar</button>
                    <button id="rb-stop" class="rb-btn rb-btn-action" style="color:var(--danger)">⏹️ Parar</button>
                </div>
                <div style="height:4px; background:#e5e7eb; border-radius:2px; margin-top:4px;">
                    <div id="rb-bar" class="rb-progress-bar"></div>
                </div>
                <a href="${CREDIT_LINK}" target="_blank" rel="noopener noreferrer" class="credit-btn">⭐ Criado por ${CREDIT_NAME}</a>
            `;
            this.ui.appendChild(panel);

            const header = panel.querySelector('.rb-header');
            this.applyDrag(header, panel);

            const qs = (s) => panel.querySelector(s);

            qs('#rb-close').onclick = () => { this.ui.remove(); };
            qs('#rb-select-new').onclick = () => { this.enableSelectionMode(); };
            qs('#rb-api-key').onchange = (e) => { 
                this.state.apiKey = e.target.value.trim(); 
                Utils.setCookie(COOKIE_NAME, this.state.apiKey); 
            };
            qs('#rb-input').oninput = (e) => this.state.text = e.target.value;

            qs('#rb-generate-ai').onclick = async () => {
                if (!this.state.apiKey) return alert('Coloque sua chave API primeiro!');
                qs('#rb-generate-ai').textContent = 'Gerando...';
                try {
                    const dados = Utils.scrapeAssignmentData();
                    const resposta = await this.gerarComIA(dados, this.state.isTargetTitle);
                    this.state.text = resposta;
                    qs('#rb-input').value = resposta;
                } catch (erro) {
                    alert('Erro: ' + erro.message);
                }
                qs('#rb-generate-ai').textContent = 'Gerar com IA';
            };

            qs('#rb-start').onclick = () => {
                const texto = qs('#rb-input').value;
                if (!texto) return alert('Escreva ou gere um texto primeiro!');
                this.state.text = texto;
                qs('.rb-controls').style.display = 'none';
                qs('#rb-running-controls').style.display = 'grid';
                this.iniciarDigitacao(texto);
            };

            qs('#rb-pause').onclick = () => {
                this.state.isPaused = !this.state.isPaused;
                qs('#rb-pause').textContent = this.state.isPaused ? '▶️ Continuar' : '⏸️ Pausar';
            };

            qs('#rb-stop').onclick = () => {
                this.state.isTyping = false;
                this.state.index = 0;
                qs('.rb-controls').style.display = 'grid';
                qs('#rb-running-controls').style.display = 'none';
                qs('#rb-bar').style.width = '0%';
            };

            const chips = panel.querySelectorAll('.rb-chip');
            chips.forEach(c => {
                c.onclick = () => {
                    chips.forEach(x => x.classList.remove('active'));
                    c.classList.add('active');
                    this.state.speed = parseInt(c.dataset.val);
                };
            });
        }

        async gerarComIA(dados, isTitulo) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.state.apiKey}`;
            let prompt = '';
            if (isTitulo) {
                prompt = `Crie um título criativo e adequado para uma redação. Tema: ${dados.tema}. Apenas o título, sem explicações.`;
            } else {
                prompt = `Escreva uma redação escolar completa. Gênero: ${dados.genero}. Tema: ${dados.tema}. Requisitos: ${dados.palavras}. Instruções: ${dados.textoApoio}. Escreva apenas o texto, sem título, formatado em parágrafos, linguagem adequada de estudante.`;
            }
            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            if (!resposta.ok) throw new Error('Verifique sua chave API');
            const json = await resposta.json();
            return json.candidates[0].content.parts[0].text.trim();
        }

        enableSelectionMode() {
            alert('Clique no campo de Título ou de Redação na página!');
            const handler = (e) => {
                const el = e.target;
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.state.target = el;
                    this.state.isTargetTitle = Utils.isTitleField(el);
                    document.removeEventListener('click', handler, true);
                    this.renderConfigPanel();
                }
            };
            document.addEventListener('click', handler, true);
        }

        async iniciarDigitacao(texto) {
            this.state.isTyping = true;
            this.state.index = 0;
            this.state.isPaused = false;
            const alvo = this.state.target;
            alvo.focus();
            this.forceReactChange(alvo, '');

            while (this.state.index < texto.length && this.state.isTyping) {
                if (this.state.isPaused) {
                    await new Promise(r => setTimeout(r, 200));
                    continue;
                }
                const char = texto[this.state.index];
                const valorAtual = alvo.value || '';
                this.forceReactChange(alvo, valorAtual + char);
                this.state.index++;
                document.getElementById('rb-bar').style.width = `${(this.state.index / texto.length) * 100}%`;
                await new Promise(r => setTimeout(r, this.state.speed + Math.random() * 10));
            }
            if (this.state.isTyping) {
                alert('✅ Concluído!');
            }
            this.state.isTyping = false;
            document.querySelector('.rb-controls').style.display = 'grid';
            document.querySelector('#rb-running-controls').style.display = 'none';
        }

        forceReactChange(el, valor) {
            el.value = valor;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    window[APP_ID] = new RedacaoBypassEngine();
})();
