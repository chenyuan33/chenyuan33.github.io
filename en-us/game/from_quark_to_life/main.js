var flush = ['all'], funcs = {
	get_current_archive: () => {
		document.getElementById('archive').value = btoa(JSON.stringify(player));
	},
	set_current_archive: () => {
		let errmsg = "Archive Content Invalid.", temp = {};
		try {
			temp = JSON.parse(atob(document.getElementById("archive").value));
		} catch (e) {
			alert(errmsg);
			return;
		}
		player = temp;
		flush.push('all');
	},
	shown: (hiddens, shown) => {
		hiddens.forEach(element => {
			document.getElementById(element).className = "hidden";
		});
		document.getElementById(shown).className = "shown";
	},
	TeXstr: num => {
		if (num < 1000) {
			return `\\(${num}\\)`;
		}
		else {
			let lognum = Math.floor(Math.log10(num));
			let x = Math.fround((num / Math.pow(10, lognum)) * 1000);
			return `\\(${x / 1000 % 10}.${x / 100 % 10}${x / 10 % 10}${x % 10}\\times10^{${lognum}}\\)`;
		}
	},
	get_quark: level => {
		if (level == player.quark.length - 1) {
			player.quark.push([0, 0]);
		}
		if (!level) {
			player.quark[0]++;
			flush.push('quark');
			return;
		}
		player.quark[0] -= (player.quark[level][1] + 1) * Math.pow(10, level);
		player.quark[level][0]++;
		player.quark[level][1]++;
		flush.push('quark');
	},
	unlock_life: () => {
		player.quark[0] -= 1e30;
		player.unlocks.life = true;
		flush.push('quark');
		flush.push('life');
	},
	how_many_people: () => player.people.unemployed + player.people.farmer,
	convert_person: () => {
		player.quark[0] -= 1e40 * Math.pow(1e10, funcs.how_many_people());
		player.people.unemployed++;
		flush.push('quark');
		flush.push('life');
	}
}, achievements = {
	first_quark: {
		title: "The First Step",
		desc: "Get the first quark.",
		check: () => player.quark[0] > 0
	},
	quark_getter: {
		title: "Speed!",
		desc: "Get a quark getter.",
		check: () => player.quark.length > 1 && player.quark[1][0] > 0
	},
	quark_getter_2nd: {
		title: "Speed Up!",
		desc: "Get a quark getter with a getter! (Requirement: Get a quark getter #2)",
		check: () => player.quark.length > 2 && player.quark[2][0] > 0
	},
	quark_getter_3rd: {
		title: "Speed Up Up!",
		desc: "Get a quark getter with a getter with a getter! (Requirement: Get a quark getter #3)",
		check: () => player.quark.length > 3 && player.quark[3][0] > 0
	},
	quark_getter_4th: {
		title: "Speed Up Up Up!",
		desc: "Get a quark getter with a getter with a getter with a getter! (Requirement: Get a quark getter #4)",
		check: () => player.quark.length > 4 && player.quark[4][0] > 0
	},
	quark_1e10: {
		title: "Many Quarks!",
		desc: `Get ${funcs.TeXstr(1e10)} quarks.`,
		check: () => player.quark[0] >= 1e10
	},
	quark_1e15: {
		title: "More Quarks!",
		desc: `Get ${funcs.TeXstr(1e15)} quarks.`,
		check: () => player.quark[0] >= 1e15
	},
	quark_1e20: {
		title: "Too Many Quarks!",
		desc: `Get ${funcs.TeXstr(1e20)} quarks.`,
		check: () => player.quark[0] >= 1e20
	},
	quark_1e25: {
		title: "What's This?",
		desc: `Get ${funcs.TeXstr(1e25)} quarks.`,
		check: () => player.quark[0] >= 1e25
	},
	life_unlocked: {
		title: "I'm a Human!",
		desc: "Start living.",
		check: () => player.unlocks.life
	},
	have_wood: {
		title: "Woods",
		desc: "Get a wood.",
		check: () => player.wood > 0
	},
	have_food: {
		title: "Foods",
		desc: "Get a food.",
		check: () => player.food > 0
	},
	have_person: {
		title: "People",
		desc: "Get a person.",
		check: () => funcs.how_many_people() > 0
	},
	adam_and_eve: {
		title: "Adam and Eve",
		desc: "Get two people.",
		check: () => funcs.how_many_people() >= 2
	},
	farm: {
		title: "Farming",
		desc: "Get a farm.",
		check: () => player.farm > 0
	},
	farmer: {
		title: "Farmers",
		desc: "Make a person a farmer.",
		check: () => player.people.farmer > 0
	},
	people_machine: {
		title: "People Machine",
		desc: "Unlock the people machine.",
		check: () => player.unlocks.people_machine
	},
	the_end: {
		title: "The End",
		desc: `Get ${funcs.TeXstr(1e30)} People.`,
		check: () => funcs.how_many_people() >= 1e30
	}
}, unlocks_check = {
	food: {
		check: () => player.wood >= 1,
		flush: "life"
	},
	farm: {
		check: () => player.wood >= 10,
		flush: "life"
	},
	people_machine: {
		check: () => funcs.how_many_people() >= 100,
		flush: "life"
	}
}, player = {
	achievements: {
		first_quark: false,
		quark_getter: false,
		quark_getter_2nd: false,
		quark_getter_3rd: false,
		quark_getter_4th: false,
		quark_1e10: false,
		quark_1e15: false,
		quark_1e20: false,
		quark_1e25: false,
		life_unlocked: false,
		have_wood: false,
		have_food: false,
		have_people: false,
		adam_and_eve: false,
		farm: false,
		farmer: false,
		people_machine: false,
		the_end: false
	},
	unlocks: {
		life: false,
		food: false,
		farm: false,
		people_machine: false
	},
	quark: [0],
	wood: 0,
	food: 0,
	farm: 0,
	people: {
		unemployed: 0,
		farmer: 0,
	},
	start_people_machine: false
};
function mainloop() {
	setInterval(() => {
		while (flush.length > 0) {
			switch (flush[0]) {
				case 'all':
					flush.push('achievements');
					flush.push('quark');
					flush.push('life');
					break;
				case 'achievements': {
					let str = `
						<h2>Achievements</h2>
					`;
					for (let key in achievements) {
						str += `
							<p class="achievement-${player.achievements[key] ? "" : "un"}getted">
								${achievements[key].title}
								<p class="achievement-desc">${achievements[key].desc}</p>
							</p>
						`;
					}
					document.getElementById("achievements").innerHTML = str;
					break;
				}
				case 'quark': {
					let str = `
						<h2>You have ${funcs.TeXstr(player.quark[0])} quarks.</h2>
						<button onclick="funcs.get_quark(0)">Get One</button>
					`;
					if (player.unlocks.life) {
						str += `
							<button onclick="funcs.convert_person()"${1e40 * Math.pow(1e10, funcs.how_many_people()) <= player.quark[0] ? "" : " disabled"}>
								Pay ${funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()))} Quarks to Convert a Person
							</button>
						`;
					}
					else if (player.quark[0] >= 1e25) {
						str += `
							<button onclick="funcs.unlock_life()"${player.quark[0] >= 1e30 ? "" : " disabled"}>
								Pay ${funcs.TeXstr(1e30)} to Unlock ${player.quark[0] >= 1e30 ? "People" : "Next Step"}
							</button>
						`;
					}
					str += `
						<table>
							<tr>
								<th>Getter</th>
								<th>Owned</th>
								<th>Bought</th>
								<th>Get One</th>
							</tr>
					`;
					for (let i = 1; i < player.quark.length; i++) {
						str += `
							<tr>
								<td>#${funcs.TeXstr(i)}</td>
								<td>${funcs.TeXstr(player.quark[i][0])}</td>
								<td>${funcs.TeXstr(player.quark[i][1])}</td>
								<td><button onclick="funcs.get_quark(${i})" ${(player.quark[i][1] + 1) * Math.pow(10, i)
								<= player.quark[0] ? "" : "disabled"
							}>
									Pay ${funcs.TeXstr((player.quark[i][1] + 1) * Math.pow(10, i))} Quarks to Get One
								</button></td>
							</tr>
						`;
					}
					document.getElementById("quark").innerHTML = str + `
						</table>
					`;
					document.getElementById("quarkButton").innerHTML = `Quarks (${funcs.TeXstr(player.quark[0])})`;
					break;
				}
				case 'life': {
					if (!player.unlocks.life) {
						break;
					}
					if (player.unlocks.life) {
						if (document.getElementById("life") === null) {
							let life = document.createElement("div");
							life.class = "hidden";
							life.id = "life";
							document.getElementById("main").appendChild(life);
							let lifeButton = document.createElement("button");
							lifeButton.innerHTML = "Life";
							lifeButton.onclick = () => funcs.shown(["quark", "life"], "life");
							document.getElementById("main").insertBefore(lifeButton, document.getElementById("quark"));
							document.getElementById("quarkButton").onclick = () => funcs.shown(["quark", "life"], "quark");
						}
					}
					let str = `<p>Wood: ${funcs.TeXstr(player.wood)} <button onclick="player.wood++; flush.push('life');">Get One</button></p>`;
					if (player.unlocks.food) {
						str += `<p>Food: ${funcs.TeXstr(player.food)} <button onclick="player.food++; flush.push('life');">Get One</button></p>`;
					}
					if (player.unlocks.farm) {
						str += `
							<p>
								Farm: ${funcs.TeXstr(player.farm)}
								<button
									onclick="player.farm++; player.wood -= (player.farm + 1) * 10; flush.push('life');"
									${player.wood >= (player.farm + 1) * 10 ? "" : "disabled"}
								>
									Get One
								</button>
							</p>
						`;
					}
					str += `
						<p>People:</p>
						<ul>
							<li>Unemployed: ${funcs.TeXstr(player.people.unemployed)}</li>
					`;
					if (player.unlocks.farm) {
						str += `
							<li>
								Farmer: ${funcs.TeXstr(player.people.farmer)}
								<button
									onclick="player.people.farmer--; player.people.unemployed++; flush.push('life');"
									${player.people.farmer > 0 ? "" : "disabled"}
								>-</button>
								<button
									onclick="player.people.farmer++; player.people.unemployed--; flush.push('life');"
									${player.people.unemployed > 0 ? "" : "disabled"}
								>+</button>
							</li>
						`;
					}
					str += "</ul>";
					if (player.unlocks.people_machine) {
						str += `
							<p>People Machine: <button onclick="player.start_people_machine = true;">Start</button></p>
						`;
					}
					document.getElementById("life").innerHTML = str;
					break;
				}
				default:
					break;
			}
			flush.shift();
			MathJax.typesetPromise();
		}
	}, 50);
	setInterval(() => {
		if (player.quark.length > 1 && player.quark[1][0] > 0) {
			player.quark[0] += player.quark[1][0];
			for (let i = 1; i < player.quark.length - 1; i++) {
				player.quark[i][0] += player.quark[i + 1][0];
			}
			flush.push('quark');
		}
		if (player.start_people_machine && player.quark[0] >= funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()))) {
			player.people.unemployed++;
			player.quark[0] -= funcs.TeXstr(1e40 * Math.pow(1e10, funcs.how_many_people()));
		}
	}, 1000);
	setInterval(() => {
		for (let key in achievements) {
			if (!player.achievements[key] && achievements[key].check()) {
				update = true;
				player.achievements[key] = true;
				document.getElementById("hadAchievements").style.display = "block";
				document.getElementById("hadAchievements").innerHTML = `
					<h2>Getted Achievement: ${achievements[key].title}</h2>
					<p>${achievements[key].desc}</p>
				`;
				setTimeout(() => document.getElementById("hadAchievements").style.display = "none", 5000);
			}
		}
		flush.push('achievements');
	}, 50);
	setInterval(() => {
		for (let key in unlocks_check) {
			if (!player.unlocks[key] && unlocks_check[key].check()) {
				player.unlocks[key] = true;
				flush.push(unlocks_check[key].flush);
			}
		}
	}, 50);
};