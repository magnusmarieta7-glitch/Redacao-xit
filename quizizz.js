(function () {
    'use strict';
    const APP_ID = 'MagnusQuizHelper';
    const YT_CHANNEL = 'https://www.youtube.com/@dicasmagnusofc';

    // ESTILOS
    const styleId = `${APP_ID}_styles`;
    document.getElementById(styleId)?.remove();
    const css = `
        :root {
            --bg: #0b0c10; --surface: #1f2833; --border: #45a29e;
            --correct-green: #2ecc71; --text: #e6e6e6; --magnus-red: #ff0000;
        }
        #${APP_ID}_overlay {
            position: fixed; top:50px; left:15px; z-index:999999; font-family:Arial,sans-serif;
        }
        .quiz-panel {
            background:var(--bg); color:var(--text); border:2px solid var(--border);
            border-radius:12px; padding:14px; width:300px; box-shadow:0 0 15px rgba(69,162,158,0.3);
            display:flex; flex-direction:column; gap:10px;
        }
        .quiz-header {
            display:flex; justify-content:space-between; align-items:center; padding:5px;
            background:rgba(255,255,255,0.05); border-radius:6px; cursor:move;
        }
        .btn-min, .btn-close {
            width:28px; height:28px; border-radius:6px; border:none; cursor:pointer; font-weight:bold;
        }
        .btn-min {background:#333; color:#ddd;}
        .btn-close {background:rgba(239,68,68,0.2); color:#ff7070;}
        .ans-text {
            background:var(--surface); padding:10px; border-radius:6px;
            border-left:4px solid var(--correct-green); font-weight:bold; font-size:14px;
        }
        .yt-link {
            background:var(--magnus-red); color:white !important; text-align:center;
            padding:5px; border-radius:6px; text-decoration:none; font-weight:bold; font-size:12px;
        }
        .highlight-correct {
            border:3px solid var(--correct-green) !important;
            box-shadow:0 0 10px rgba(46,204,113,0.5) !important;
        }
    `;
    const s=document.createElement('style');
    s.id=styleId; s.textContent=css; document.head.appendChild(s);

    class MagnusQuizHelper {
        constructor(){
            this.overlay=null; this.lastQid=''; this.drag={x:0,y:0,act:false};
            this.init();
        }
        init(){
            this.buildUI();
            this.startScanLoop();
        }
        buildUI(){
            this.overlay=document.createElement('div');
            this.overlay.id=`${APP_ID}_overlay`;
            this.overlay.innerHTML=`
                <div class="quiz-panel">
                    <div class="quiz-header" id="dragHandle">
                        <span><strong>📘 Quiz Helper @Magnus</strong></span>
                        <div>
                            <button class="btn-min">−</button>
                            <button class="btn-close">✕</button>
                        </div>
                    </div>
                    <div class="ans-text">Aguardando pergunta...</div>
                    <a href="${YT_CHANNEL}" target="_blank" rel="noopener noreferrer" class="yt-link">💻 Canal @dicasmagnusofc</a>
                    <small style="font-size:10px;opacity:0.7">Apenas estudo — Você clica manualmente!</small>
                </div>
            `;
            document.body.appendChild(this.overlay);
            // arrastar painel
            const h=this.overlay.querySelector('#dragHandle');
            const panel=this.overlay.querySelector('.quiz-panel');
            h.addEventListener('mousedown',e=>{
                if(e.target.closest('.btn-min,.btn-close,.yt-link'))return;
                this.drag.act=true; this.drag.x=e.clientX-panel.offsetLeft; this.drag.y=e.clientY-panel.offsetTop;
            });
            document.addEventListener('mousemove',e=>{
                if(!this.drag.act)return;
                panel.style.left=(e.clientX-this.drag.x)+'px'; panel.style.top=(e.clientY-this.drag.y)+'px';
            });
            document.addEventListener('mouseup',()=>this.drag.act=false);
            // botões fechar/min
            this.overlay.querySelector('.btn-close').onclick=()=>{this.overlay.remove();};
        }

        // lógica: pegar dados, buscar correta, destacar SEM clicar
        async checkQuestion(){
            // pegar dados via rede/respostas carregadas internamente da plataforma
            const ansNode=this.overlay.querySelector('.ans-text');
            let qid=document.querySelector('[data-question-id]')?.dataset.questionId||'';
            if(!qid){ansNode.textContent='Nenhuma pergunta detectada';return;}
            if(qid===this.lastQid)return;
            this.lastQid=qid;
            // limpar destaques antigos
            document.querySelectorAll('.highlight-correct').forEach(el=>el.classList.remove('highlight-correct'));

            // método: ler dados carregados na memória/respostas salvas da API do quiz
            try{
                let quizData=window.__QUIZ_DATA__||window.quizQuestions||{};
                let qObj=Array.isArray(quizData)?quizData.find(q=>q.id===qid):null;
                let correctText='';
                if(qObj?.options&&qObj?.correctAnswer){
                    let correctOpt=qObj.options.find(o=>o.id===qObj.correctAnswer);
                    correctText=correctOpt?.text||'Não foi possível ler';
                    // destacar elemento visual correspondente
                    document.querySelectorAll('[class*="option"]').forEach(optEl=>{
                        if(optEl.textContent.trim().includes(correctText.trim())){
                            optEl.classList.add('highlight-correct');
                        }
                    });
                }
                ansNode.textContent=`✅ Correta: ${correctText||'Verifique manualmente'}`;
            }catch(e){
                ansNode.textContent='❌ Erro ao ler dados / Atualização pode ter bloqueado';
            }
        }

        startScanLoop(){
            setInterval(()=>{this.checkQuestion();},1200);
        }
    }
    window[APP_ID]=new MagnusQuizHelper();
})();
