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
			return `${num}`;
		}
		else {
			let lognum = Math.floor(Math.log10(num));
			let x = Math.fround((num / Math.pow(10, lognum)) * 1000);
			let fx = xx => (xx + "").includes(".") ? (xx + "").split(".")[0] : xx + "";
			return `${fx(x / 1000 % 10)}.${fx(x / 100 % 10)}${fx(x / 10 % 10)}${fx(x % 10)}e${lognum}`;
		}
	},
	do_hard_reset: () => {
		player = {
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
				quark_dimension_1: false,
				quark_dimension_1_getted_2: false,
				quark_dimension_1_getter: false,
				quark_dimension_1_getter_2nd: false,
				quark_dimension_1_getter_3rd: false,
				quark_dimension_1_getter_4th: false,
				quark_dimension_2: false,
				quark_dimension_2_getter_4th: false,
				quark_dimension_3: false,
				quark_dimension_4: false,
				the_end: false
			},
			quark: [[0]],
			quark_points: [0],
			unlock_dimension: false
		};
		flush.push('all');
	},
	hard_reset: () => {
		if (confirm("Are you sure you want to reset the game? This will erase all your progress and achievements. If you want to save your progress, please click 'Cancel' and then visit 'Save/Load' to export your progress.")) {
			funcs.do_hard_reset();
		}
	},
	get_quark: (dimension, level) => {
		document.getElementById(`quarkButton${dimension}-${level}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (level == player.quark[dimension].length - 1) {
			player.quark[dimension].push([0, 0]);
		}
		if (!level) {
			player.quark[dimension][0]++;
			flush.push('quark');
			return;
		}
		player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension);
		player.quark[dimension][level][0]++;
		player.quark[dimension][level][1]++;
		flush.push('quark');
	},
	get_quark_max: (dimension, level) => {
		document.getElementById(`quarkButtonMax${dimension}-${level}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (level == player.quark[dimension].length - 1) {
			player.quark[dimension].push([0, 0]);
		}
		while (player.quark[dimension][0] >= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension))
		{
			player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][level][1]) * Math.pow(10, level) * Math.pow(20, dimension);
			player.quark[dimension][level][0]++;
			player.quark[dimension][level][1]++;
		}
		flush.push('quark');
	},
	get_quark_max_dimension: dimension => {
		document.getElementById(`quarkButtonMaxDimension${dimension}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		for (let i = 1; i < player.quark[dimension].length; i++) {
			while (player.quark[dimension][0] >= Math.pow(2, player.quark[dimension][i][1]) * Math.pow(10, i) * Math.pow(20, dimension))
			{
				if (i == player.quark[dimension].length - 1) {
					player.quark[dimension].push([0, 0]);
				}
				player.quark[dimension][0] -= Math.pow(2, player.quark[dimension][i][1]) * Math.pow(10, i) * Math.pow(20, dimension);
				player.quark[dimension][i][0]++;
				player.quark[dimension][i][1]++;
			}
		}
		flush.push('quark');
	},
	get_quark_max_all: () => {
		document.getElementById("quarkButtonMaxAll").disabled = true;
		for (let i = 0; i < player.quark.length; i++) {
			for (let j = 1; j < player.quark[i].length; j++) {
				while (player.quark[i][0] >= Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i)) {
					if (i == player.quark.length - 1) {
						player.quark.push([0]);
						player.quark_points.push(0);
					}
					if (j == player.quark[i].length - 1) {
						player.quark[i].push([0, 0]);
					}
					player.quark[i][0] -= Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i);
					player.quark[i][j][0]++;
					player.quark[i][j][1]++;
				}
			}
		}
		flush.push('quark');
	},
	convert_quark: dimension => {
		document.getElementById(`convertQuarkButton${dimension}`).disabled = true;
		if (dimension == player.quark.length - 1) {
			player.quark.push([0]);
			player.quark_points.push(0);
		}
		if (player.quark[dimension + 1].length == 1) {
			player.quark[dimension + 1].push([0, 0]);
		}
		player.quark[dimension + 1][0] += Math.floor(player.quark[dimension][0] / Math.pow(10, (dimension + 3) * 10));
		player.quark[dimension] = [0];
		player.unlock_dimension = true;
		flush.push('quark');
	}
}, achievements = {
	first_quark: {
		title: "The First Step",
		desc: "Get the first quark.",
		check: () => player.quark[0][0] > 0
	},
	quark_getter: {
		title: "Speed!",
		desc: "Get a quark getter.",
		check: () => player.quark[0].length > 1 && player.quark[0][1][0] > 0
	},
	quark_getter_2nd: {
		title: "Speed Up!",
		desc: "Get a quark getter with a getter! (Requirement: Get a quark getter #2)",
		check: () => player.quark[0].length > 2 && player.quark[0][2][0] > 0
	},
	quark_getter_3rd: {
		title: "Speed Up Up!",
		desc: "Get a quark getter with a getted-with-a-getter getter! (Requirement: Get a quark getter #3)",
		check: () => player.quark[0].length > 3 && player.quark[0][3][0] > 0
	},
	quark_getter_4th: {
		title: "Speed Up Up Up!",
		desc: "Get a can-get-quark-getter getter with a getted-with-a-getter getter! (Requirement: Get a quark getter #4)",
		check: () => player.quark[0].length > 4 && player.quark[0][4][0] > 0
	},
	quark_1e10: {
		title: "Many Quarks!",
		desc: `Get ${funcs.TeXstr(1e10)} quarks.`,
		check: () => player.quark[0][0] >= 1e10
	},
	quark_1e15: {
		title: "More Quarks!",
		desc: `Get ${funcs.TeXstr(1e15)} quarks.`,
		check: () => player.quark[0][0] >= 1e15
	},
	quark_1e20: {
		title: "Too Many Quarks!",
		desc: `Get ${funcs.TeXstr(1e20)} quarks.`,
		check: () => player.quark[0][0] >= 1e20
	},
	quark_1e25: {
		title: "What's This?",
		desc: `Get ${funcs.TeXstr(1e25)} quarks.`,
		check: () => player.quark[0][0] >= 1e25
	},
	quark_dimension_1: {
		title: "Another Dimension!",
		desc: "Get a quark that has a dimension of 1.",
		check: () => player.quark.length > 1 && player.quark[1][0] > 0
	},
	quark_dimension_1_getted_2: {
		title: "Start all over again!",
		desc: "Own 2 quarks with a dimension of 1.",
		check: () => player.quark.length > 1 && player.quark[1][0] > 1
	},
	quark_dimension_1_getter: {
		title: "Another Way to Speed: Quark Points",
		desc: "Get a getter of dimension 1.",
		check: () => player.quark.length > 1 && player.quark[1].length > 1 && player.quark[1][1][0] > 0
	},
	quark_dimension_1_getter_2nd: {
		title: "Speed Up Your Quark Points",
		desc: "Get a getter of dimension 1 with a getter!",
		check: () => player.quark.length > 1 && player.quark[1].length > 2 && player.quark[1][2][0] > 0
	},
	quark_dimension_1_getter_3rd: {
		title: "Quark Points Speed Up Up!",
		desc: "Let the quark points speed up up! (Requirement: Get a quark getter #3 at dimension 1)",
		check: () => player.quark.length > 1 && player.quark[1].length > 3 && player.quark[1][3][0] > 0
	},
	quark_dimension_1_getter_4th: {
		title: "It's far way to get here!",
		desc: "Get a quark getter #4 at dimension 1",
		check: () => player.quark.length > 1 && player.quark[1].length > 4 && player.quark[1][4][0] > 0
	},
	quark_dimension_2: {
		title: "Dimension 2!",
		desc: "Get a quark that has a dimension of 2.",
		check: () => player.quark.length > 2 && player.quark[2][0] > 0
	},
	quark_dimension_2_getter_4th: {
		title: "It's same way but getting harder!",
		desc: "Get a getter #4 at dimension 2.",
		check: () => player.quark.length > 2 && player.quark[1].length > 4 && player.quark[2][4][0] > 0
	},
	quark_dimension_3: {
		title: "Dimension 3!",
		desc: "Get a quark that has a dimension of 3.",
		check: () => player.quark.length > 3 && player.quark[3][0] > 0
	},
	quark_dimension_4: {
		title: "Dimension 4!",
		desc: "Get a quark that has a dimension of 4.",
		check: () => player.quark.length > 4 && player.quark[4][0][0] > 0
	},
	the_end: {
		title: "The End",
		desc: "Get quarks with a dimension of 10.",
		check: () => player.quark.length > 10 && player.quark[10][0][0] > 0
	}
}, player = {};
function mainloop() {
	if (localStorage.game_quarks === undefined) {
		funcs.do_hard_reset();
	}
	else {
		player = JSON.parse(atob(localStorage.game_quarks));
	}
	setInterval(() => {
		while (flush.length > 0) {
			switch (flush[0]) {
				case 'all':
					flush.push('achievements');
					flush.push('quark');
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
						<button onclick='funcs.hard_reset()'>Hard Reset</button>
						<button onclick='funcs.get_quark_max_all()' id='quarkButtonMaxAll'>Get Max All Quark Getters</button>
					`;
					if (player.unlock_dimension) {
						str += "<p>";
						for (let i = 0; i < player.quark.length; i++) {
							str += `<button onclick="funcs.shown([${Array.from({length: player.quark.length}, (_, j) => ("quarkDimensionDiv" + j)).map(x => `'${x}'`).join(', ')}], 'quarkDimensionDiv${i}')">Dimension ${i}</button>`;
						}
						str += "</p>";
					}
					for (let i = 0; i < player.quark.length; i++) {
						if (i && !player.unlock_dimension) {
							continue;
						}
						str += `
							<div id='quarkDimensionDiv${i}' class='${document.getElementById("quarkDimensionDiv" + i) === null && i == 0 || document.getElementById("quarkDimensionDiv" + i) !== null && document.getElementById("quarkDimensionDiv" + i).className === "shown" ? "shown" : "hidden"}'>
								<h2>You have ${funcs.TeXstr(player.quark[i][0])} quarks${player.unlock_dimension ? ` in dimension ${i}` : ""}.</h2>
								<p>
									${i == 0 ? "<button onclick='funcs.get_quark(" + i + ", 0)' id='quarkButton" + i + "-0'>Get One</button>" : ""}
									<button onclick="funcs.get_quark_max_dimension(${i})" id="quarkButtonMaxDimension${i}">Get Max All the quark getters in this dimension</button>
									${player.quark.length > 1 && player.quark[1][0] > 0 ? `
										<button
											onclick="funcs.convert_quark(${i})"
											id="convertQuarkButton${i}"
											${Math.floor(player.quark[i][0] / Math.pow(10, (i + 3) * 10)) < 1 ? "disabled" : ""}
										>
											Clear this dimension and convert to ${funcs.TeXstr(Math.floor(player.quark[i][0] / Math.pow(10, (i + 3) * 10)))} quarks in the next dimension
										</button>
									` : (player.quark[0][0] >= 1e25 ? `
										<button
											onclick="funcs.convert_quark(${i})"
											id="convertQuarkButton${i}"
											${player.quark[0][0] >= 1e30 ? "" : "disabled"}
										>Get 1e30 quarks to unlock the next step</button>
									` : "")}
								</p>
								${i != 0 ? `
									<p>You have ${funcs.TeXstr(player.quark_points[i - 1])} quark points in this dimension.</p>
									<p class="about-quark-points">The quarks in previous dimension provides a ${funcs.TeXstr(player.quark_points[i - 1] + 1 + player.quark[i][0])}x multiplier</p>
								` : ""}
								<table>
									<tr>
										<th>Getter</th>
										<th>Owned</th>
										<th>Bought</th>
										<th>Get One</th>
										<th>Get Max</th>
									</tr>
						`;
						for (let j = 1; j < player.quark[i].length; j++) {
							str += `
									<tr>
										<td>#${funcs.TeXstr(j)}</td>
										<td>${funcs.TeXstr(player.quark[i][j][0])}</td>
										<td>${funcs.TeXstr(player.quark[i][j][1])}</td>
										<td><button
											onclick="funcs.get_quark(${i}, ${j})"
											id="quarkButton${i}-${j}"
											${Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i) <= player.quark[i][0] ? "" : "disabled"}
										>
											Pay ${funcs.TeXstr(Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i))} Quarks to Get One
										</button></td>
										<td><button
											onclick="funcs.get_quark_max(${i}, ${j})"
											id="quarkButtonMax${i}-${j}"
											${Math.pow(2, player.quark[i][j][1]) * Math.pow(10, j) * Math.pow(20, i) <= player.quark[i][0] ? "" : "disabled"}
										>Get Max</button></td>
									</tr>
							`;
						}
						str += `
								</table>
							</div>
						`;
					}
					document.getElementById("main").innerHTML = str;
					break;
				}
				default:
					break;
			}
			flush.shift();
		}
	}, 50);
	setInterval(() => {
		for (let i = 0; i < player.quark.length; i++) {
			if (player.quark[i].length > 1 && player.quark[i][1][0] > 0) {
				while (player.quark_points.length < i + 2) {
					player.quark_points.push(0);
				}
				if (i == 0) {
					player.quark[i][0] += player.quark[i][1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
				else {
					player.quark_points[i - 1] += player.quark[i][1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
				for (let j = 1; j < player.quark[i].length - 1; j++) {
					player.quark[i][j][0] += player.quark[i][j + 1][0] * (player.quark_points[i] + 1 + player.quark[i + 1][0]);
				}
			}
		}
		flush.push('quark');
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
	setTimeout(() => setInterval(() => localStorage.game_quarks = btoa(JSON.stringify(player)), 50), 1000);
};