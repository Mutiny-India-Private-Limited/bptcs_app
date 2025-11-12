<nav class="sidebar d-flex flex-column p-3">
    <a href="#" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <span class="fs-4">Dashboard</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
        <!-- Blogs with collapsible submenu -->
        {{-- <li>
            <a class="nav-link text-dark" data-bs-toggle="collapse" href="#blogsMenu" role="button" aria-expanded="false"
                aria-controls="blogsMenu">
                <i class="fas fa-blog"></i> Blogs
                <i class="fas fa-chevron-down ms-auto"></i>
            </a>
            <div class="collapse ps-3" id="blogsMenu">
                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="{{ route('admin.blogs.add') }}" class="nav-link text-dark">Add Blog</a></li>
                    <li><a href="{{ route('admin.blogs.manage') }}" class="nav-link text-dark">Manage Blogs</a></li>
                </ul>
            </div>
        </li> --}}
        <li>
            <a href="{{ route('admin.blogs.add') }}" class="nav-link text-dark">
                <i class="fas fa-blog"></i> Add Blog
            </a>
        </li>
        <li>
            <a href="{{ route('admin.notifications.add') }}" class="nav-link text-dark">
                <i class="fas fa-bell"></i> Send Notification
            </a>
        </li>
    </ul>
</nav>
