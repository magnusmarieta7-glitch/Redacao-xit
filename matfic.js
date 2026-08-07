(function () {
    'use strict';
    const APP_ID = 'MagnusMathAutoUpdate';
    const YT_CHANNEL = 'https://www.youtube.com/@dicasmagnusofc';

    const styleId = `${APP_ID}_styles`;
    document.getElementById(styleId)?.remove();
    const css = `
        :root {
            --bg: #0b0c10; --surface: #1f2833; --border: #45a29e;
            --accent: #66fcf1; --text: #e6e6e6; --ok-green: #2ecc71; --magnus-red: #ff0000;
        }
        #${APP_ID}_overlay {
            position: fixed; top:50px; left:15px; z-index:999999; font-family:Arial,sans-serif;
            max-width:340px;
        }
        .auto-panel {
            background:var(--bg); color:var(--text); border:2px solid var(--border);
            border-radius:12px; padding:14px;
            box-shadow:0 0 15px rgba(69,162,158,0.3);
            display:flex; flex-direction:column; gap:10px;
            max-height:550px; overflow-y:auto;
        }
        .auto-header {
            display:flex; justify-content:space-between; align-items:center; padding:5px;
            background:rgba(255,255,255,0.05); border-radius:6px; cursor:move;
        }
        .btn-min, .btn-close {
            width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-weight:bold;
        }
        .btn-min {background:#333; color:#ddd;}
        .btn-close {background:rgba(239,68,68,0.2); color:#ff7070;}
        .box-pergunta {
            background:rgba(255,255,255,0.05); padding:8px; border-radius:6px;
            border-left:3px solid var(--border); font-size:12px;
        }
        .box-resposta {
            background:var(--surface); padding:10px; border-radius:6px;
            border-left:4px solid var(--ok-green); white-space:pre-line; font-weight:500;
        }
        .status {font-size:11px; color:var(--accent);}
        .yt-link {
            background:var(--magnus-red); color:white !important; text-align:center;
            padding:5px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:12px;
        }
        small {font-size:10px; opacity:0.7; text-align:center;}
    `;
    const s=document.createElement('style');
    s.id=styleId; s.textContent=css; document.head.appendChild(s);

    class MagnusMathAutoUpdate {
        constructor(){
            this.overlay=null; this.drag={x:0,y:0,act:false};
            this.lastQuestionText=''; // GUARDA ÚLTIMA PERGUNTA
            this.scanActive=true; // CONTINUA VERIFICANDO
            this.init();
        }
        init(){
            this.buildUI();
            this.startAutoRefresh(); // INICIA A ATUALIZAÇÃO AUTOMÁTICA
        }

        buildUI(){
            this.overlay=document.createElement('div');
            this.overlay.id=`${APP_ID}_overlay`;
            this.overlay.innerHTML=`
                <div class="auto-panel">
                    <div class="auto-header" id="dragHandle">
                        <span><strong>🔄 Atualiza Automático @Magnus</strong></span>
                        <div>
                            <button class="btn-min">−</button>
                            <button class="btn-close">✕</button>
                        </div>
                    </div>
                    <div class="status" id="status">🔄 Monitorando perguntas...</div>
                    <div class="box-pergunta">
                        <strong>Pergunta:</strong><br>
                        <span id="textoPergunta">Carregando...</span>
                    </div>
                    <div class="box-resposta">
                        <strong>Resposta + Passo:</strong><br>
                        <span id="textoResposta">Aguardando detectar...</span>
                    </div>
                    <a href="${YT_CHANNEL}" target="_blank" rel="noopener noreferrer" class="yt-link">💻 Canal @dicasmagnusofc</a>
                    <small>⚠️ Só mostra! Você responde manualmente!</small>
                </div>
            `;
            document.body.appendChild(this.overlay);

            // ARRASTAR JANELA
            const h=this.overlay.querySelector('#dragHandle');
            const panel=this.overlay.querySelector('.auto-panel');
            h.addEventListener('mousedown',e=>{
                if(e.target.closest('.btn-min,.btn-close,.yt-link'))return;
                this.drag.act=true;
                this.drag.x=e.clientX-panel.offsetLeft;
                this.drag.y=e.clientY-panel.offsetTop;
            });
            document.addEventListener('mousemove',e=>{
                if(!this.drag.act)return;
                panel.style.left=(e.clientX-this.drag.x)+'px';
                panel.style.top=(e.clientY-this.drag.y)+'px';
            });
            document.addEventListener('mouseup',()=>this.drag.act=false);

            // FECHAR E PARAR TUDO
            this.overlay.querySelector('.btn-close').onclick=()=>{
                this.scanActive=false; // PARA DE MONITORAR
                this.overlay.remove();
            };
        }

        // PEGA TEXTO DA PERGUNTA DA TELA
        getCurrentQuestionText(){
            const seletores = [
                '[class*="question-text"]','[class*="pergunta"]','[data-testid*="question"]',
                '.question-content','main > div p','.quiz-question'
            ];
            for(const sel of seletores){
                const el=document.querySelector(sel);
                if(el){
                    const txt=el.textContent.trim();
                    if(txt.length>12) return txt;
                }
            }
            return '';
        }

        // CALCULA/INTERPRETA E RESUME
        processarPergunta(texto){
            texto=texto.toLowerCase();
            let nums=texto.match(/\d+(?:[.,]\d+)?/g)||[];
            nums=nums.map(n=>+n.replace(',','.'));

            if(nums.length===2){
                let [a,b]=nums;
                if(texto.includes('mais')||texto.includes('soma')||texto.includes('+')) return `📝 ${a} + ${b} = ${a+b}`;
                if(texto.includes('menos')||texto.includes('subtraí')||texto.includes('-')) return `📝 ${a} − ${b} = ${a-b}`;
                if(texto.includes('vezes')||texto.includes('multiplic')||texto.includes('×')) return `📝 ${a} × ${b} = ${a*b}`;
                if(texto.includes('divid')||texto.includes('÷')){
                    if(b===0) return `📝 ${a} ÷ ${b} → ❌ Não existe divisão por zero!`;
                    return `📝 ${a} ÷ ${b} = ${(a/b).toFixed(3)}`;
                }
                if(texto.includes('elevado')||texto.includes('potênci')) return `📝 ${a} elevado a ${b} = ${Math.pow(a,b)}`;
            }
            if(texto.includes('raiz quadrada') && nums.length===1){
                let n=nums[0];
                return `📝 Raiz quadrada de ${n} ≈ ${Math.sqrt(n).toFixed(3)}`;
            }
            if(texto.includes('quadrado')&&texto.includes('lado')&&nums.length===1){
                let l=nums[0]; return `📐 Quadrado: Perímetro=${4*l} | Área=${l*l}`;
            }
            if(texto.includes('retângulo')&&nums.length===2){
                let [b,h]=nums; return `📐 Retângulo: Perímetro=${2*(b+h)} | Área=${b*h}`;
            }
            if(texto.includes('círculo')&&nums.length===1){
                let r=nums[0]; return `📐 Círculo: Comprimento≈${(2*Math.PI*r).toFixed(2)} | Área≈${(Math.PI*r*r).toFixed(2)}`;
            }
            return `ℹ️ Pergunta complexa / não reconhecida automaticamente.\nDados: ${nums.join(', ')}`;
        }

        // LOOP QUE VERIFICA E ATUALIZA QUANDO MUDA
        startAutoRefresh(){
            if(!this.scanActive) return;
            const atual=document.getElementById('textoPergunta');
            const resp=document.getElementById('textoResposta');
            const status=document.getElementById('status');

            const textoAtual=this.getCurrentQuestionText();
            // SÓ TROCA SE FOR PERGUNTA NOVA DIFERENTE DA ÚLTIMA
            if(textoAtual && textoAtual!==this.lastQuestionText){
                this.lastQuestionText=textoAtual;
                atual.textContent=textoAtual;
                resp.textContent=this.processarPergunta(textoAtual);
                status.textContent='✅ Nova pergunta detectada!';
            }
            // SE NÃO ACHOU, AVISA
            if(!textoAtual){
                atual.textContent='Aguardando carregar pergunta...';
                resp.textContent='';
                status.textContent='❓ Não encontrou texto da pergunta';
            }

            // REPETE A CADA 1,2 SEGUNDOS (rápido mas leve)
            setTimeout(()=>this.startAutoRefresh(),1200);
        }
    }
    window[APP_ID]=new MagnusMathAutoUpdate();
})();
