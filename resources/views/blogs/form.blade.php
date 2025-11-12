@extends('layouts.app')

{{-- @section('title', $blogData ? 'Edit Blog' : 'Add Blog') --}}
@section('title', 'Blogs')

@section('header')
    <div class="mb-4">
        <h2 class="h4">{{ $blogData ? 'Edit Blog' : 'Add Blog' }}</h2>
        <p class="text-muted">Create or edit blog content</p>
    </div>
@endsection

@section('content')
    <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
            <strong class="card-title">{{ $blogData ? 'Edit Blog' : 'Add Blog' }}</strong>
            <a class="btn btn-sm btn-primary" href="{{ route('admin.blogs.manage') }}">Manage Blog</a>
        </div>
        <div class="card-body">
            <form action="{{ $blogData ? route('admin.blogs.update', encrypt($blogData->id)) : route('admin.blogs.store') }}"
                method="POST" enctype="multipart/form-data">
                @csrf
                @if ($blogData)
                    @method('PUT')
                @endif

                <div class="row g-3">

                    {{-- Category --}}
                    <div class="col-md-6">
                        <label class="form-label">Category <span class="text-danger">*</span></label>
                        <select name="category" class="form-select select-new-value">
                            <option value="">Select or create a category</option>
                            @foreach ($categories as $c)
                                <option value="{{ $c->category }}"
                                    {{ $blogData && $blogData->category == $c->category ? 'selected' : '' }}>
                                    {{ $c->category }}
                                </option>
                            @endforeach
                        </select>
                        @error('category')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Author --}}
                    <div class="col-md-6">
                        <label class="form-label">Author <span class="text-danger">*</span></label>
                        <input type="text" name="author" value="{{ old('author', $blogData->author ?? 'Admin') }}"
                            class="form-control" placeholder="Enter author">
                        @error('author')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Publish Date --}}
                    <div class="col-md-6">
                        <label class="form-label">Publish Date <span class="text-danger">*</span></label>
                        <input type="date" name="pub_date"
                            value="{{ old('pub_date', $blogData->pub_date ?? now()->format('Y-m-d')) }}"
                            class="form-control">
                        @error('pub_date')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Heading --}}
                    <div class="col-md-6">
                        <label class="form-label">Heading <span class="text-danger">*</span></label>
                        <input type="text" name="heading" value="{{ old('heading', $blogData->heading ?? '') }}"
                            class="form-control" placeholder="Enter heading">
                        @error('heading')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Sub Heading --}}
                    <div class="col-md-6">
                        <label class="form-label">Sub Heading</label>
                        <input type="text" name="sub_heading"
                            value="{{ old('sub_heading', $blogData->sub_heading ?? '') }}" class="form-control"
                            placeholder="Enter sub heading">
                        @error('sub_heading')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Featured Image --}}
                    <div class="col-md-12">
                        <label class="form-label">Featured Image <span class="text-danger">*</span></label>
                        <input type="file" name="featured_image" accept="image/*" class="form-control file-input"
                            value={{ $blogData?->featured_image }}>
                        {{-- Hidden input to track existing image --}}
                        {{-- @if ($blogData?->featured_image)
                            <input type="hidden" name="old_featured_image" value="{{ $blogData->featured_image }}">
                        @endif --}}
                        <div class="file-preview mt-3">
                            @if ($blogData?->featured_image)
                                <div class="mt-3">
                                    <div class="border rounded p-2 d-inline-block bg-light ">
                                        <img src="{{ asset('storage/' . $blogData->featured_image) }}"
                                            class="img-fluid rounded" style="width:150px; height:150px; object-fit:cover;">
                                        {{-- <button type="button" class="btn btn-sm btn-danger remove-preview">Remove</button> --}}
                                    </div>
                                </div>
                            @endif
                        </div>

                        @error('featured_image')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>
                    {{-- Attachment --}}
                    <div class="col-md-12">
                        <label class="form-label">Attachment</label>
                        <input type="file" name="attachment"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" class="form-control file-input">
                        {{-- @if ($blogData?->attachment)
                            <input type="hidden" name="old_attachment_image" value="{{ $blogData->attachment }}">
                        @endif --}}
                        <div class="file-preview mt-3 ">
                            @if ($blogData?->attachment)
                                <div class="mt-3">
                                    <p class="text-muted small mb-1">Current Attachment:</p>

                                    <div
                                        class="border rounded p-2 bg-light d-flex align-items-center justify-content-between">

                                        <span class="text-primary fw-semibold">
                                            {{ basename($blogData->attachment) }}
                                        </span>

                                        <a href="{{ asset('storage/' . $blogData->attachment) }}" target="_blank"
                                            class="btn btn-sm btn-outline-primary">
                                            View
                                        </a>
                                        {{-- <button type="button" class="btn btn-sm btn-danger remove-preview">Remove</button> --}}
                                    </div>
                                </div>
                            @endif
                        </div>

                        @error('attachment')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>


                    {{-- Content --}}
                    <div class="col-md-12">
                        <label class="form-label">Content <span class="text-danger">*</span></label>
                        <textarea name="description" rows="6" id="summernote" class="form-control" placeholder="Enter content">{{ old('description', $blogData->description ?? '') }}</textarea>
                        @error('description')
                            <div class="text-danger small">{{ $message }}</div>
                        @enderror
                    </div>

                    {{-- Submit --}}
                    <div class="col-12 text-end">
                        <button type="submit" class="btn btn-primary">
                            {{ $blogData ? 'Update Blog' : 'Add Blog' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <script>
        $(document).ready(function() {

            function updatePreview(input) {
                var previewContainer = $(input).siblings('.file-preview');
                previewContainer.html(''); // Clear previous preview

                if (input.files && input.files[0]) {
                    var file = input.files[0];

                    // Only show preview if file is an image
                    if (file.type.startsWith('image/')) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var img = $('<img>')
                                .attr('src', e.target.result)
                                .css({
                                    width: '200px',
                                    height: '200px',
                                    'object-fit': 'cover',
                                    'border-radius': '5px',
                                    display: 'block', // ensures button is below
                                    marginBottom: '5px'
                                })
                                .addClass('img-fluid rounded border');

                            // Wrapper div for image + remove button
                            var wrapper = $('<div>')
                                .addClass('border rounded p-2 d-inline-block bg-light preview-wrapper')
                                .append(img)
                                .append(
                                    '<button type="button" class="btn btn-sm btn-danger remove-preview">Remove</button>'
                                );

                            previewContainer.append(wrapper);
                        }
                        reader.readAsDataURL(file);
                    }
                }
            }

            // Run on change
            $('.file-input').on('change', function() {
                updatePreview(this);
            });

            // Run on page load if input already has a file
            $('.file-input').each(function() {
                if (this.files && this.files.length > 0) {
                    updatePreview(this);
                }
            });

            // Remove preview handler
            $(document).on('click', '.remove-preview', function() {
                var wrapper = $(this).closest('.preview-wrapper');
                var previewContainer = wrapper.parent();
                var input = previewContainer.siblings('.file-input');

                wrapper.remove(); // remove the preview wrapper
                input.val(''); // reset file input

                // var hiddenInput = previewContainer.siblings('input[type="hidden"]');
                // if (hiddenInput.length) {
                //     hiddenInput.val('');
                // }
            });

        });

        // $(document).ready(function() {

        //     function updatePreview(input) {
        //         var previewContainer = $(input).siblings('.file-preview');
        //         previewContainer.html(''); // Clear previous preview

        //         if (input.files && input.files[0]) {
        //             var file = input.files[0];

        //             if (file.type.startsWith('image/')) {
        //                 var reader = new FileReader();
        //                 reader.onload = function(e) {
        //                     var img = $('<img>')
        //                         .attr('src', e.target.result)
        //                         .css({
        //                             width: '150px',
        //                             height: '150px',
        //                             'object-fit': 'cover',
        //                             'border-radius': '5px',
        //                             display: 'block',
        //                             marginBottom: '5px'
        //                         })
        //                         .addClass('img-fluid rounded border');

        //                     var wrapper = $('<div>')
        //                         .addClass('border rounded p-2 d-inline-block bg-light preview-wrapper')
        //                         .append(img)
        //                         .append(
        //                             '<button type="button" class="btn btn-sm btn-danger remove-preview">Remove</button>'
        //                             );

        //                     previewContainer.append(wrapper);
        //                 }
        //                 reader.readAsDataURL(file);
        //             }
        //         }
        //     }

        //     // On file change
        //     $('.file-input').on('change', function() {
        //         updatePreview(this);
        //     });

        //     // Remove preview
        //     $(document).on('click', '.remove-preview', function() {
        //         var wrapper = $(this).closest('.preview-wrapper');
        //         var previewContainer = wrapper.parent();
        //         var input = previewContainer.siblings('.file-input');

        //         wrapper.remove(); // remove the preview
        //         input.val(''); // reset file input

        //         // Optional: if there’s an old image, clear hidden input so backend knows to remove it
        //         var hiddenInput = previewContainer.siblings('input[type="hidden"]');
        //         if (hiddenInput.length) {
        //             hiddenInput.val('');
        //         }
        //     });

        // });
    </script>
@endsection
