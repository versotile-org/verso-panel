# Verso Navbar

Experimental navbar for Verso.

## Development

1. Run `pnpm dev` to start the development server.
2. In Verso `verso/src/app.rs`, point panel url to the dev server.

```rust
// let path = std::env::current_dir()
//     .unwrap()
//     .join("resources/panel.html");
// let url = ServoUrl::from_file_path(path.to_str().unwrap()).unwrap();
let url = ServoUrl::parse("http://localhost:5173/").unwrap();
init_servo
    .servo
    .handle_events(vec![EmbedderEvent::NewWebView(url, init_servo.browser_id)]);
```

## Release

1. Run `pnpm build` to generate a single HTML file.
2. Replace `verso/resources/panel.html` with `dist/index.html`.
