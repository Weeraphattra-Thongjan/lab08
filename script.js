// Blog Class - รับผิดชอบในการจัดการข้อมูลบล็อก
class Blog {
    constructor(id, title, content) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.createdDate = new Date();
      this.updatedDate = new Date();
    }
  
    update(title, content) {
      this.title = title;
      this.content = content;
      this.updatedDate = new Date();
    }
  
    getFormattedDate() {
      return this.updatedDate.toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  
  // BlogManager Class - รับผิดชอบการจัดการ array ของบล็อก
  class BlogManager {
    constructor() {
      this.blogs = this.loadBlogsFromLocalStorage(); // โหลดบล็อกจาก LocalStorage เมื่อเริ่มต้น
    }
  
    addBlog(title, content) {
      const blog = new Blog(Date.now(), title, content);
      this.blogs.push(blog);
      this.sortBlogs();
      this.saveBlogsToLocalStorage(); // บันทึกบล็อกใน LocalStorage
      return blog;
    }
  
    updateBlog(id, title, content) {
      const blog = this.getBlog(id);
      if (blog) {
        blog.update(title, content);
        this.sortBlogs();
        this.saveBlogsToLocalStorage(); // บันทึกบล็อกใน LocalStorage
      }
      return blog;
    }
  
    deleteBlog(id) {
      this.blogs = this.blogs.filter((blog) => blog.id !== id);
      this.saveBlogsToLocalStorage(); // บันทึกบล็อกใน LocalStorage
    }
  
    getBlog(id) {
      return this.blogs.find((blog) => blog.id === id);
    }
  
    sortBlogs() {
      this.blogs.sort((a, b) => b.updatedDate - a.updatedDate);
    }
  
    //บันทัดที่เพิ่มเข้ามา
    //ฟังก์ชั่นนี้จะบันทึกข้อมูลลงใน LocalStorage เมื่อมีการ เพิ่ม แก้ไข หรือลบข้อมูล
    saveBlogsToLocalStorage() {
      localStorage.setItem("blogs", JSON.stringify(this.blogs));
    }
  
    loadBlogsFromLocalStorage() {
      const savedBlogs = localStorage.getItem("blogs");
      if (savedBlogs) {
        const blogsArray = JSON.parse(savedBlogs);
        // นำข้อมูลจาก LocalStorage มาสร้างเป็น Blog instances
        return blogsArray.map(blog => new Blog(blog.id, blog.title, blog.content));
      }
      return [];
    }
  }
  
  // UI Class - รับผิดชอบการจัดการ DOM และ Events
  class BlogUI {
    constructor(blogManager) {
      this.blogManager = blogManager;
      this.initElements();
      this.initEventListeners();
      this.render();
    }
  
    initElements() {
      this.form = document.getElementById("blog-form");
      this.titleInput = document.getElementById("title");
      this.contentInput = document.getElementById("content");
      this.editIdInput = document.getElementById("edit-id");
      this.formTitle = document.getElementById("form-title");
      this.cancelBtn = document.getElementById("cancel-btn");
      this.blogList = document.getElementById("blog-list");
    }
  
    initEventListeners() {
      // การจัดการการ submit form
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
  
      // การจัดการปุ่มยกเลิก
      this.cancelBtn.addEventListener("click", () => {
        this.resetForm();
      });
    }
  
    handleSubmit() {
      const title = this.titleInput.value.trim();
      const content = this.contentInput.value.trim();
      const editId = parseInt(this.editIdInput.value);
  
      if (title && content) {
        if (editId) {
          this.blogManager.updateBlog(editId, title, content);
        } else {
          this.blogManager.addBlog(title, content);
        }
        this.resetForm();
        this.render();
      }
    }
  
    editBlog(id) {
      const blog = this.blogManager.getBlog(id);
      if (blog) {
        this.titleInput.value = blog.title;
        this.contentInput.value = blog.content;
        this.editIdInput.value = blog.id;
        this.formTitle.textContent = "แก้ไขบล็อก";
        this.cancelBtn.classList.remove("hidden");
        window.scrollTo(0, 0);
      }
    }
  
    deleteBlog(id) {
      if (confirm("คุณต้องการลบบล็อกนี้หรือไม่?")) {
        this.blogManager.deleteBlog(id);
        this.render();
      }
    }
  
    resetForm() {
      this.form.reset();
      this.editIdInput.value = "";
      this.formTitle.textContent = "เขียนบล็อกใหม่";
      this.cancelBtn.classList.add("hidden");
    }
  
    render() {
      this.blogList.innerHTML = this.blogManager.blogs
        .map(
          (blog) => `
          <div class="blog-post">
            <h2 class="blog-title">${blog.title}</h2>
            <div class="blog-date">
              วันที่อัปเดต: ${blog.getFormattedDate()}
            </div>
            <div class="blog-content">
              ${blog.content.replace(/\n/g, "<br>")}
            </div>
            <div class="blog-actions">
              <button class="btn-edit" onclick="blogUI.editBlog(${blog.id})">แก้ไข</button>
              <button class="btn-delete" onclick="blogUI.deleteBlog(${blog.id})">ลบ</button>
            </div>
          </div>
        `
        )
        .join("");
    }
  }
  
  // สร้าง instance และเริ่มต้นการทำงาน
  const blogManager = new BlogManager();
  const blogUI = new BlogUI(blogManager);