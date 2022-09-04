const todos = {
    todoList: [],
    todoListEl: null,
    completeListEl: null,

    init: function () {
        this.initElement();
        this.render();
    },

    initElement: function () {
        const addContent = document.querySelector(".add-content");
        const addBtn = document.querySelector(".add-btn");

        addContent.addEventListener("keyup", this.handleAddContent.bind(this));
        addBtn.addEventListener("click", this.handleAddBtn.bind(this, addContent));

        this.todoListEl = document.querySelector(".todo");
        this.completeListEl = document.querySelector(".todoComplete");
    },

    render: function () {
        this.fetchData();
    },

    fetchData: async function () {
        const datas = await this.callAPI("/api/todo");

        if (datas.success) {
            this.setTodoList(datas.datas);
        }

        this.loadItem();
    },

    itemEventBind: function (todo) {
        const { id } = todo;
        const complete = document.querySelector(`#${id} [type="checkbox"]`);
        const remove = document.querySelector(`#${id} [type="button"]`);

        complete.addEventListener("change", this.handleCompleteChange.bind(this, id));
        remove.addEventListener("click", this.handleRemove.bind(this, id));
    },

    setTodoList: function (todos) {
        this.todoList = todos;
    },

    getTodoList: function () {
        return this.todoList;
    },

    // DATA =============================================================================
    loadItem: function () {
        this.todoList?.forEach(todo => {
            this.makeItemView(todo);
        });
    },

    makeItem: async function (value) {
        const newItem = { id: this.uuid(), content: value, complete: false };
        const options = {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        };
        const datas = await this.callAPI(`/api/todo/add`, options);

        if (datas.success) {
            this.todoList.push(newItem);
            this.makeItemView(newItem);
        }
    },

    removeItem: async function (id) {
        const options = { method: "delete", body: JSON.stringify(id) };
        const datas = await this.callAPI(`/api/todo/delete/${id}`, options);

        if (datas.success) {
            const itemIdx = this.todoList.findIndex(item => item.id === id);
            const removeItem = this.todoList.splice(itemIdx, 1);
            this.removeItemView(id, removeItem[0].complete ? "completeListEl" : "todoListEl");
        }
    },

    updateItem: async function (id) {
        const item = this.todoList.filter(todo => todo.id === id);
        const options = { method: "put" };
        const datas = await this.callAPI(`/api/todo/update/${item[0].id}`, options);

        if (datas.success) {
            item[0].complete = !item[0].complete;
            this.updateItemView(item[0]);
        }
    },

    // VIEW =============================================================================
    makeItemView: function (viewData) {
        const { id, content, complete } = viewData;
        const template = `
            <li id=${id}>
                <input type="checkbox" ${complete ? "checked" : ""} />
                <span>${content}</span>
                <button type="button">X</button>
            </li>
        `;

        if (complete) {
            this.completeListEl.insertAdjacentHTML("beforeend", template);
        }
        else {
            this.todoListEl.insertAdjacentHTML("beforeend", template); // innerHTML 대체
        }

        this.itemEventBind(viewData);
    },

    removeItemView: function (id, listType) {
        listType = listType || "todoListEl";

        const item = document.querySelector(`#${id}`);
        this[listType].removeChild(item);
    },

    updateItemView: function (item) {
        const itemEl = document.querySelector(`#${item.id}`);
        const appendListType = item.complete ? "completeListEl" : "todoListEl";
        const removeListType = item.complete ? "todoListEl" : "completeListEl";

        this[removeListType].removeChild(itemEl);
        this[appendListType].appendChild(itemEl);
    },

    // EVENT =============================================================================
    handleAddContent: function (e) {
        const { target, key } = e;

        if (key === "Enter") {
            const value = target.value;

            if (!value) {
                console.log("내용을 입력해주세요");
                return;
            }

            this.makeItem(value);
            target.value = "";
        }
    },

    handleAddBtn: function (target, e) {
        const value = target.value;

        if (!value) {
            console.log("내용을 입력해주세요");
            return;
        }

        this.makeItem(value);
        target.value = "";
    },

    handleCompleteChange: function (id, e) {
        this.updateItem(id);
    },

    handleRemove: function (id, e) {
        this.removeItem(id);
    },

    // UTIL =============================================================================
    callAPI: async function (url, options) {
        const response = await fetch(`https://localhost:5000${url}`, options);
        const datas = await response.json();

        return datas;
    },

    getTargetArea: function (id) {
        const parent = document.querySelector(`#${id}`);
        const itemArea = parent.closest("div");
        const result = itemArea.classList.value;

        return result;
    },

    uuid: function () {
        return 'todo-yxxx'.replace(/[xy]/g, (c) => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

todos.init();