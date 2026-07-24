const id = new URLSearchParams(window.location.search).get('id');
Promise.all([
	fetch('/blog/category.json').then(res => res.json()),
	i18nValue('langName').then(i18nName => fetch(`/blog/${i18nName}/data.json`)).then(res => res.json()),
	new Promise(resolve => document.readyState == 'loading' ? document.addEventListener('DOMContentLoaded', resolve) : resolve())
]).then(async ([categories, data]) => {
	if (!Object.hasOwn(data.blog, id)) {
		location.replace('/blog/index.html');
	}
	document.title = `${data.blog[id].title} - ${await i18nValue('blog.name')} - ${await i18nValue('siteName')}`;
	document.getElementById('title').innerHTML = await inlineMdToHtml(data.blog[id].title);
	document.getElementById('summary').innerHTML = await mdToHtml(data.blog[id].summary);
	categories[id].forEach(category => document.getElementById('category').insertAdjacentHTML('beforeend', `
		<a href="/blog/index.html?category=${category}">${data.category[category]}</a>
	`));
	document.getElementById('content').append(document.createRange().createContextualFragment(await mdToHtml(await ((await fetch(`/blog/${await i18nValue('langName')}/${id}.md`)).text()), { safe: false })));
});