let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)), updateHeaderBlanks = () => {
	document.getElementById("headerBlanks").style.width = document.getElementById("header").style.width;
	document.getElementById("headerBlanks").style.height = document.getElementById("header").style.height;
	console.log(document.getElementById("headerBlanks").style.width, document.getElementById("headerBlanks").style.height);
};