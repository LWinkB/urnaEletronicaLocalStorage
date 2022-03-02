let yourVoteFor = document.querySelector(".left1 span");
let positionName = document.querySelector(".left2 span");
let description = document.querySelector(".informations");
let instructions = document.querySelector(".div2");
let rightContent = document.querySelector(".div1-right");
let numberBox = document.querySelector(".numberBox");
let res = document.querySelector("#resultado");
let currentStage = 0;
let squareNumber = "";
let whiteVote = false;
let isNulo = false
let allVotes = []
let reset = document.querySelector(".reloadUrna")



function startStage() {
    reset.style.display = "none"
    let stages = stage[currentStage];
    let numberHtml = "";
    squareNumber = "";
    whiteVote = false;
    isNulo = false;

    for (let i = 0; i < stages.numbers; i++) {        //Adicionar o numero de quadrados necessario para votar.
        if (i === 0) {
            numberHtml += '<div class="square focus"></div>'
        } else {
            numberHtml += '<div class="square"></div>';
        }
    }

    yourVoteFor.style.display = "none";
    positionName.innerHTML = stages.position;   //informações necessarias para começar os processos.
    description.innerHTML = "";
    instructions.style.display = "none";
    rightContent.innerHTML = "";
    numberBox.innerHTML = numberHtml;

}

function updateDisplay() {

    let candidatoIndex = stage[currentStage].candidates.findIndex((item) => {
        return item.number === squareNumber
    });
    if (candidatoIndex >= 0) {
        let candidatoInfo = stage[currentStage].candidates[candidatoIndex];


        yourVoteFor.style.display = 'block';
        instructions.style.display = 'block';
        description.innerHTML = `Nome: ${candidatoInfo.name}</br> Partido: ${candidatoInfo.partido}`;

        let picturesHtml = '';
        for (let i in candidatoInfo.picture) {
            if (candidatoInfo.picture[i].small) {
                picturesHtml += `<div class="right1 small"> <img src="${candidatoInfo.picture[i].url}" alt=""/>${candidatoInfo.picture[i].legenda}</div>`

            } else {
                picturesHtml += `<div class="right1"> <img src="${candidatoInfo.picture[i].url}" alt=""/>${candidatoInfo.picture[i].legenda}</div>`
            }

        }
        rightContent.innerHTML = picturesHtml;
    } else {
        yourVoteFor.style.display = 'block';
        instructions.style.display = 'block';
        description.innerHTML = "<div class= 'warning focus'>VOTO NULO</div>";
        isNulo = true

    }


}


function clicou(n) {
    let numberEl = document.querySelector('.square.focus');
    if (numberEl !== null) {
        numberEl.innerHTML = n;
        squareNumber = `${squareNumber}${n}`;

        numberEl.classList.remove('focus');   //tira o foco do numero depois de digitado
        if (numberEl.nextElementSibling !== null) {        //verifica se tem um proximo campo
            numberEl.nextElementSibling.classList.add('focus')  //adiciona o foco ao proximo elemento
        } else {              //Se nao tiver próximo elemento, chama minha função para atualziar dislay.
            updateDisplay();
        }


    }
}


function branco() {
    if (squareNumber === '') {
        whiteVote = true;
        yourVoteFor.style.display = 'block';
        instructions.style.display = 'block';
        numberBox.innerHTML = '';
        description.innerHTML = "<div class= 'warning focus'>VOTO EM BRANCO</div>";
        rightContent = '';

    }
}

function corrige() {
    startStage();
}

function confirma() {
    if (whiteVote === true) {
        let totalWhite = parseInt(localStorage.getItem('whiteVote'));
        if (!totalWhite) {
            totalWhite = 0;
        }
        totalWhite++
        localStorage.setItem('whiteVote', totalWhite.toString());
        this.confirmVote()

        return;
    }
    if (squareNumber.length !== stage[currentStage].numbers) {
        return;
    }

    if (isNulo) {
        let totalNulo = parseInt(localStorage.getItem('votosNulos'));
        if (!totalNulo) {
            totalNulo = 0;
        }
        totalNulo++
        localStorage.setItem('votosNulos', totalNulo.toString())
        console.log(totalNulo)

        this.confirmVote();
    }


    let indexOfCandidate = stage[currentStage].candidates.findIndex((item) => {
        return item.number === squareNumber
    });

    if (indexOfCandidate >= 0) {

        let allVotes = parseInt(localStorage.getItem(stage[currentStage].candidates[indexOfCandidate].number))

        if (!allVotes) {
            allVotes = 0;
        }
        allVotes++
        localStorage.setItem(stage[currentStage].candidates[indexOfCandidate].number.toString(), allVotes.toString());
        this.confirmVote();
    }
}


function confirmVote() {
    let stages = stage[currentStage];

    let confirmVotes = false;
    if (whiteVote === true) {
        confirmVotes = true;
        allVotes.push({
            etapa: stage[currentStage].position,
            voto: 'Voto em branco',
            candidatos: 'Voto em branco'

        })
    } else if (squareNumber.length === stages.numbers) {
        confirmVotes = true; // voto valido
        let positionCandidate; // candidato inteiro

        // retorna obj candidato do numero
        stage[currentStage].candidates.forEach(candidate => {
            if (candidate.number === squareNumber) {
                positionCandidate = candidate // {}
            }
        })

        console.log(positionCandidate)

        if (positionCandidate === undefined) {
            positionCandidate = {name: "Voto nulo"};
        }

        allVotes.push({
            etapa: stage[currentStage].position,
            candidatos: positionCandidate.name,
            voto: squareNumber
        })

    }

    if (confirmVotes) {
        currentStage++;
        if (stage[currentStage] !== undefined) {
            startStage();

        } else {
            document.querySelector(".screen").innerHTML = "<div class= 'final-warning focus'>FIM!</div>"
            reset.style.display = "block"





        }
    }
}

function mostrarResultadoTela() {

    stage.forEach(etapa => {
        res.innerHTML += '<br/>' + etapa.position;
        res.innerHTML += "<div class='space'></div>";
        etapa.candidates.forEach(candidato => {
            let votes = localStorage.getItem(candidato.number);
            if (!votes) {
                votes = 0;
            }
            res.innerHTML += `<div class='finalResult'> ${candidato.name} : ${votes}</div>`
        })
    })

    res.innerHTML += "<br/>VOTOS NULOS: ";

    let votosNulos = localStorage.getItem('votosNulos')

    if (!votosNulos) {
        votosNulos = 0;
    }
    let whiteVote = localStorage.getItem('whiteVote');
    if (!whiteVote) {
        whiteVote = 0;
    }
    res.innerHTML += +votosNulos
    res.innerHTML += "<p></p>"
    res.innerHTML += "VOTOS BRANCOS: ";

    res.innerHTML += +whiteVote

}












