import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');
        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true) {    
        if (loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando...'));
            loadingEl.setAttribute('id', 'loading');
            this.formEl.appendChild(loadingEl);
        } else {
            if(document.getElementById('loading'))
                document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault(); // previne o recarregar da pagina no submit

        const repoInput = this.inputEl.value;

        // se não houver dados vindo do input
        if (repoInput.lenght === 0)
            return;

        try {
            const response = await api.get(`/repos/${repoInput}`);
            const { name, description, html_url, owner: { avatar_url } } = response.data;
            this.repositories.push({ name, description, avatar_url, html_url });
            this.inputEl.value = '';
            this.setLoading();
            this.render();
        } catch (err) {
            alert('O repositório não existe');
        }

        this.setLoading(false);

    }

    render() {
        // limpa a estrutura da lista no DOM
        this.listEl.innerHTML = '';

        // cria a lista no DOM
        this.repositories.forEach(repo => {

            // cria o <img> na lista no DOM
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            // cria o <strong> na lista no DOM
            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            // cria o <p> na lista no DOM
            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            // cria o <a> na lista no DOM
            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            // cria o <li> para começar a lista no DOM
            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            // atribui ao listEl os elementos para compor o DOM
            this.listEl.appendChild(listItemEl);
        });
    }
}

new App();