let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)), updateHeaderBlanks = () => {
	document.getElementById("headerBlanks").style.width = document.getElementById("header").offsetWidth + "px";
	document.getElementById("headerBlanks").style.height = document.getElementById("header").offsetHeight + "px";
	console.log(document.getElementById("headerBlanks").style.width, document.getElementById("headerBlanks").style.height);
};