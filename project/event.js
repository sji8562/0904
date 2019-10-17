var sound_hit = new Audio('../sounds/hit.mp3');
var sound_collision = new Audio('../sounds/collision.mp3');
var gauge = 0;
var one = 0.1;
var id;
var power = 0;
var tempX;
var tempY;
var TimerID;
var i = 0;
var isfirst = true;
var guide_x;
var guide_y;
//마우스를 현재 좌표를 받기위한 오브젝트 좌표
function findOffset(obj) {
    var curX = 0;
    var curY = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft;
            curY += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curX, y: curY};
    }
}
//캔버스 수정을 위한 펑션
function updateCanvas(e) {
    //canvas좌표를 pos에 가져옴
    var pos = findOffset(canvas);

    mouseX = e.pageX - pos.x;   // 마우스의 현재 좌표
    mouseY = e.pageY - pos.y;

    nowdegree = 180 * Math.atan2(mouseX - cue.x, mouseY - cue.y) / Math.PI;

    if (cue.mouse && !cue.drag) {
        canvas.style.cursor = cursor_grab;
    } else if (cue.drag) {
        canvas.style.cursor = cursor_drag;
    } else {
        canvas.style.cursor = 'auto';
    }
    if (cue.drag) {
        cue.degree = -(nowdegree - 90);
    }

    draw_cue();
}

function startDrag() {
    if (cue.mouse == true) {
        cue.drag = true;
    }
}

function stopDrag() {
    one = 0.1;
    if (cue.drag == true) {
        cue.drag = false;
    }
}

function frame() {
    one = one + 0.01;
    gauge += one;
    if (gauge >= 100.0) {
        one = -one;
    }

    if (gauge <= 0) {
        one = 0.1;
        one = Math.abs(one);
    }
    elem.style.width = gauge + '%';
    document.getElementById("label").innerHTML = gauge.toFixed(1) + '%';
}
//게이지 채우기
function startGauge() {
    id = setInterval(frame, 10);
    waitkey = false;
}
//게이지 멈추고 공을 친다
function stopGauge() {
    clearInterval(id);
    power = gauge;
    gauge = 0;
    elem.style.width = gauge + '%';
    document.getElementById("label").innerHTML = gauge.toFixed(1) + '%';
    hit.disabled = true;
    cue_execute();
    waitkey = true;
}

function cue_motion() {
    i++;
    cue.x = cue.x + i * Math.cos(degreeToRadian * cue.degree);
    cue.y = cue.y + i * Math.sin(degreeToRadian * cue.degree);

    draw_cue();
    if (i >= 100) {
        clearInterval(TimerID);
        cue.x = tempX - 20 * Math.cos(degreeToRadian * cue.degree);
        cue.y = tempY - 20 * Math.sin(degreeToRadian * cue.degree);
        draw_cue();
        sound_hit.play();
        i = 0;
         setTimeout(function () {
        cue.visible = false;
        HitBall();
        draw();
         }, 500);

    }

    cue.x = tempX;
    cue.y = tempY;
}
//큐 움직임
function cue_execute() {

    tempX = cue.x;
    tempY = cue.y;

    TimerID = setInterval(cue_motion, 10);
}
//가이드 점선
function draw_guide_1() {
    var gx = balls[nowPlayer].x + 60;
    var gy = balls[nowPlayer].y + 60;

    var degree = cue.degree * degreeToRadian;

    var point_x = gx - 20 * Math.cos(degree);
    var point_y = gy - 20 * Math.sin(degree);

    //왼쪽 쿠션

    var guide_left_x = 60;
    var guide_left_y = gy - Math.tan(degreeToRadian * cue.degree) * (point_x - 60);

    //오른쪽 쿠션
    var guide_right_x = 1140;
    var guide_right_y = gy - Math.tan(degreeToRadian * cue.degree) * (point_x - 1140);

    //상단 쿠션
    var guide_top_x = gx - Math.tan(degreeToRadian * (90 - cue.degree)) * (point_y - 60);
    var guide_top_y = 60;

    //하단 쿠션
    var guide_bottom_x = gx - Math.tan(degreeToRadian * (90 - cue.degree)) * (point_y - 610);
    var guide_bottom_y = 610;


    if (isfirst) {
        guide_x = guide_left_x;
        guide_y = guide_left_y;
    }

    //가이드라인 각도조절

    //왼쪽상단부터 오른쪽상단까지
    if (guide_y <= 60 && (guide_x > 60 || guide_x <= 1140)) {
        guide_x = guide_top_x; //가변값
        guide_y = guide_top_y; //610
        isfirst = false;
    }

    //오른쪽 상단부터 오른쪽 하단까지
    if (guide_x >= 1140 && (guide_y > 60 || guide_y <= 610)) {
        guide_x = guide_right_x; // 1140
        guide_y = guide_right_y; // 가변값
    }

    //오른쪽 하단부터 왼쪽 하단까지
    if (guide_y >= 610 && (guide_x >= 60 || guide_x < 1140)) {
        guide_x = guide_bottom_x; //가변값
        guide_y = guide_bottom_y; //610
    }

    //왼쪽하단에서 왼쪽 상단까지
    if (guide_x <= 60 && (guide_y >= 60 || guide_y < 610)) {
        guide_x = guide_left_x; //60
        guide_y = guide_left_y; //가변값
        isfirst = false;
    }

//점선그리기
    ctx.setLineDash([5, 10]);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(point_x, point_y);
    ctx.lineTo(guide_x, guide_y);
    ctx.stroke();
    ctx.closePath();
}
//선수 교체
function playerChange() {
    p1 = document.getElementById("p1");
    p2 = document.getElementById("p2");
    nowPlayer++;
    nowPlayer = nowPlayer % 2;

    if (nowPlayer == 0) {
        p2.style.color = "lightgrey";
        p1.style.color = "dodgerblue";
    }
    else {
        p2.style.color = "dodgerblue";
        p1.style.color = "lightgrey";
    }
    p1.innerHTML = "Player1 : " + scoreinfo[0];
    p2.innerHTML = "Player2 : " + scoreinfo[1];

    draw();
}

var waitkey = true;
var waite = true;

function keyEvent1(e) {
    player.disabled = true;
    if (waitkey) {
        if (e.keyCode === 38) { //위키
            cue.degree--;
        }
        else if (e.keyCode === 40) { //아래키
            cue.degree++;
        }

        else if (e.keyCode === 37) { //왼쪽키
            cue.degree -= 3;
        }


        else if (e.keyCode === 39) { //오른쪽키
            cue.degree += 3;
        }


        else if (e.keyCode === 67) { //c버튼
            if (nowPlayer == 0) {
                p2.style.color = "lightgrey";
                p1.style.color = "dodgerblue";
            }
            else {
                p2.style.color = "dodgerblue";
                p1.style.color = "lightgrey";
            }
            p1.innerHTML = "Player1 : " + scoreinfo[0];
            p2.innerHTML = "Player2 : " + scoreinfo[1];
            playerChange();
        }

        else if (e.keyCode === 32 && waite) { //스페이스버튼
            startGauge();
            waite = false;
        }
        draw();
    }
}

function keyEvent2(e) {
    if (e.keyCode === 32 && waite) { //스페이스버튼
        stopGauge();
        waite = false;
        waitkey = true;
    }
}

function getscore() {
    var text;
    var turnover = false;
    if (!balls[nowPlayer].loss) //적구를 맞지 않았을때
    {
        if (balls[nowPlayer].red1 && balls[nowPlayer].red2) {
            scoreinfo[nowPlayer]++; //득점
            text = "Nice!";
        }

        else if (balls[nowPlayer].red1 || balls[nowPlayer].red2) {
            //무실점 무득점
            text = "Let's do better!";
            turnover = true;
        }


        else {
            text = "Oh My God !!"; //실점
            if (scoreinfo[nowPlayer] > 0)
                scoreinfo[nowPlayer]--;
            turnover = true;
        }
    }
    else {
        text = "Oh My God !!"; //실점
        if (scoreinfo[nowPlayer] > 0)
            scoreinfo[nowPlayer]--;
        turnover = true;
    }   //오류나는 이유 나우공이 바뀌기전에 공이 맞은정보가 초기화 되야함
    //또한 메시지도 즉시 출력됨

    balls[nowPlayer].red1 = false;  //공이 맞은 정보 초기화
    balls[nowPlayer].red2 = false;
    balls[nowPlayer].loss = false;

    if (turnover) {
        nowPlayer = ++nowPlayer % 2;// 차례변경
        cue.x = balls[nowPlayer].x + 60;
        cue.y = balls[nowPlayer].y + 60;
    }
    p1 = document.getElementById("p1");
    p2 = document.getElementById("p2");
    //위 Player1,2색깔변경
    //본인차례일때 파란색
    if (nowPlayer == 0) {
        p2.style.color = "lightgrey";
        p1.style.color = "dodgerblue";
    }
    else {
        p2.style.color = "dodgerblue";
        p1.style.color = "lightgrey";
    }
    //플레이어 점수
    p1.innerHTML = "Player1 : " + scoreinfo[0];
    p2.innerHTML = "Player2 : " + scoreinfo[1];

    //영역지우기
    ctx.clearRect(0, 0, w, h);
    //다시 불러옴
    table.draw();
    //공을 쳤을때 좋다, 더 잘하자 , 좋지않다 폰트
    setTimeout(function () {
        ctx.font = 'italic 100px calibri';
        ctx.fillText(text, 250, 250);
    }, 500)


}
//도움말 내용
function help_alert() {
    swal(

        "도움말",
        "룰\n" +
        "1. 한번 움직일때 빨간공 두개를 맞춰라\n"+
        "2. 하얀공을 맞으면 실점\n"+
        "3. 공을 하나도 맞추지 못할경우 실점\n\n"+

        "마우스로 게임할때\n"+
        "1. 큐를 드래그해서 각도를 맞춘다\n" +
        "2. 공을친다 버튼을 눌러 힘을 조절할수있다\n\n" +
        "3. 버튼을 놓으면 큐로 치면서 공이 나아간다"+

        "키보드로 겡미할때\n"+
        "1. 왼,오른쪽 버튼(←, →) : 큰 각도 조절 \n" +
        "2. 위,아래 버튼 (↑, ↓) : 작은 각도 조절\n" +
        "3. 스페이스바 : 공을친다 버튼을 눌렀을때와 같음\n" +
        "4. C버튼 : 선수교체 버튼을 눌렀을때와 같음\n"+
        "5. W버튼 : 공이 빨리 움직여 시간을 단축한다\n\n"+
        "by Sji8562",

        "info"
    );
}
