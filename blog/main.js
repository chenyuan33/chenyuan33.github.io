const choseCategories = new Set(new URLSearchParams(window.location.search).getAll('category'));
Promise.all([
	fetch('/blog/category.json').then(res => res.json()),
	i18nValue('langName').then(i18nName => fetch(`/blog/${i18nName}/data.json`)).then(res => res.json()),
	new Promise(resolve => document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', resolve) : resolve())
]).then(async ([categories, data]) => {
	Object.entries(data.category).forEach(([id, name]) => document.getElementById('categorySelector').insertAdjacentHTML('beforeend', `
		<input type="checkbox" name="category" value="${id}" id="categorySelector-${id}" ${choseCategories.has(id) ? " checked" : ""}/><label for="categorySelector-${id}">${name}</label><br />
	`));
	for (const [id, {title, summary}] of Object.entries(data.blog)) {
		if (!choseCategories.size || categories[id].some(category => choseCategories.has(category))) {
			document.getElementById('list').insertAdjacentHTML('beforeend', `
				<div class="card">
					<h3><a href="/blog/show/index.html?id=${id}">${await inlineMdToHtml(title)}</a></h3>
					<p>${(() => {
						let html = '';
						categories[id].forEach(category => html += `<a class="category" href="?category=${category}">${data.category[category]}</a>`);
						return html;
					})()}</p>
					<p>${await mdToHtml(summary)}</p>
				</div>
			`);
		}
	}
});