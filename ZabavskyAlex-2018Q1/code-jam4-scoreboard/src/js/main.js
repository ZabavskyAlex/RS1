import User from './model/User'
import sessions from '../data/damps/sessions.json';
import users from '../data/damps/users.json'
import Chart from '../../node_modules/chart.js'

const allUsers = [],
    dataGraf = [];

export default function readJSON(demoFlag){

    let session = sessions.session1;
    if(demoFlag)
        session =sessions.session2;

    let countRounds = Object.keys(session.rounds).length;

    if(allUsers.length === 0){
        users.forEach((user) => {
            let newUser = new User(user.uid, user.displayName);
            allUsers.push(newUser);
        })
    }

    allUsers.forEach((user) =>{
        addUserInfo(countRounds, session, user);
    });

    addTableScore(countRounds, session);
}

function addUserInfo(countRounds, session, user) {
    user.allTime = 0;
    user.rounds = [];
    for (let i = 0; i < countRounds; i++ ){

        let roundInfo = session.rounds[i].solutions[user.uid];
        if(roundInfo)
            user.allTime += Number(roundInfo.time['$numberLong']);
        else
            user.allTime += 150;

        user.rounds.push(session.rounds[i].solutions[user.uid]);
    }
}

function addTableScore(countRounds, session) {
    document.getElementById('table').innerHTML = "";

    let table = document.createElement('table'),
        thName = document.createElement('th'),
        thAllTime = document.createElement('th'),
        tr = document.createElement('tr'),
        thComparison = document.createElement('th');

    thName.appendChild(document.createTextNode('NAME'));
    thAllTime.appendChild(document.createTextNode('All TIME'));
    thComparison.appendChild(document.createTextNode('Comparison'));
    tr.appendChild(thName);

    for(let i = 0; i < countRounds; i++) {
        let thNameLevel = document.createElement('th');
        if (countRounds === 1) {
            thNameLevel.appendChild(document.createTextNode('DEMO'));
        }
        else
            thNameLevel.appendChild(document.createTextNode(session.puzzles[i].name));

        tr.appendChild(thNameLevel);
    }

    tr.appendChild(thAllTime);
    table.id = 'resultTable';
    table.appendChild(tr);

    if(countRounds > 1)
        tr.appendChild(thComparison);

    allUsers.forEach((user) => {

        let tr = document.createElement('tr'),
            tdName = document.createElement('td'),
            tdAllTime = document.createElement('td');

        tdName.appendChild(document.createTextNode(user.displayName));
        tdAllTime.appendChild(document.createTextNode(user.allTime));
        tr.appendChild(tdName);

        for(let i = 0; i < countRounds; i++){

            let td = document.createElement('td');
            td.classList.add('tooltip');
            td.id = user.uid + ' ' + i + ' ' + session.alias;

            let existPlay = session.rounds[i].solutions[user.uid],
                texNode = document.createTextNode('150');

            if(existPlay)
                texNode = document.createTextNode(existPlay.time['$numberLong']);

            td.appendChild(texNode);
            tr.appendChild(td);
        }

        tr.appendChild(tdAllTime);

        let сheckNew = document.createElement('input'),
            td = document.createElement('td');

        сheckNew.type = "checkbox";
        td.appendChild(сheckNew);
        сheckNew.id = session.alias + ' ' + user.uid + ' ' + user.displayName;

        if(countRounds > 1)
            tr.appendChild(td);

        table.appendChild(tr);

    });
    document.getElementById('table').appendChild(table);
}

document.getElementById('radio').addEventListener('click', (e) => {
    if(e.target.tagName == 'INPUT'){
        let flag = false;
        if(e.target.id === 'demo')
            flag = true;
        readJSON(flag);
        if(flag){
            document.getElementById('lineChart').style.display = 'none';
            dataGraf.clear();
        }
        else
            document.getElementById('lineChart').style.display = 'block';
    }
});

document.getElementById('table').onmouseover = function handler(e) {
    if(e.target.classList.contains('tooltip')){
        if(e.target.childElementCount === 0){
            let uid = e.target.id.split(' ')[0],
                roundNumber = e.target.id.split(' ')[1],
                sessionName = e.target.id.split(' ')[2],
                session = (sessionName === 'rsschool') ? 'session1': 'session2',
                context = 'no context';

            if(sessions[session].rounds[roundNumber].solutions[uid])
                context = sessions[session].rounds[roundNumber].solutions[uid].code;

            let span = document.createElement('span');
            span.classList.add('tooltiptext');
            span.appendChild(document.createTextNode(context));

            e.target.appendChild(span);
        }
    }
};

document.getElementById('table').onclick = function (e) {

    if(e.target.type === "checkbox"){
        let uId = e.target.id.split(' ')[1],
            sessionName = e.target.id.split(' ')[0],
            session = (sessionName === 'rsschool') ? 'session1': 'session2',
            displayName = e.target.id.split(' ')[3],
            obj,
            countRound = (sessionName === 'rsschool') ? 10: 1,
            allPoint = [];
        console.log(displayName);

        for(let i = 0; i < countRound; i++){

            let existPlay = sessions[session].rounds[i].solutions[uId],
                point = 150;

            if(existPlay)
                point = Number(existPlay.time['$numberLong']);
            allPoint.push(point);
        }

        obj = {
            label: displayName,
            data: allPoint,
            lineTension: 0,
            fill: false,
            borderColor: "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16),
            backgroundColor: 'transparent',
            pointBorderColor: 'orange',
            pointBackgroundColor: 'rgba(255,150,0,0.5)',
            borderDash: [5, 5],
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded'
        };

        dataGraf.push(obj);

        addChartLine(dataGraf);
    }

};

export function addChartLine( data) {
    console.log(data);

    let speedCanvas = document.getElementById("lineChart");

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;

    let Data = {
        labels: ['Matching Game', 'Matching Game II',	'Classy',	'Articles Everywhere',	'Anchor',
            'Signing Up',	'Linear',	'Envious Heirs',	'Mariana',	'Tech Stack'],
        datasets: data
    };

    let chartOptions = {
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: false,
                    color: "black"
                },
                scaleLabel: {
                    display: true,
                    labelString: "Name test",
                    fontColor: "white"
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "white",
                    borderDash: [2, 5],
                },
                scaleLabel: {
                    display: true,
                    labelString: "Time",
                    fontColor: "white"
                }
            }]
        }
    };

    let lineChart = new Chart(speedCanvas, {
        type: 'line',
        data: Data,
        options: chartOptions
    });

};
