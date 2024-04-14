function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
document.getElementById("header_blanks").style.width = document.getElementById("header").style.width;
document.getElementById("header_blanks").style.height = document.getElementById("header").style.height;