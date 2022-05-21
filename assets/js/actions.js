let introScreen = true;
window.addEventListener("keypress", function (event) {
    // 当按下Enter键点击开始按钮
    if (event.key === "Enter") {
        document.getElementById("start-button").click();
    }
});

function start() {
    document.getElementById("intro-screen").style.visibility = "hidden";
    document.getElementById("start-button").style.visibility = "hidden";
    document.getElementById("over-canvas").style.visibility = "visible";
    document.getElementById("passages").style.visibility = "visible";
    introScreen = false;
}