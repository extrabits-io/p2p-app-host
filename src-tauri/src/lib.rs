use std::{sync::Mutex, time::Duration};

use tauri::{async_runtime, path::BaseDirectory, Manager};
use tokio::time::sleep;

use crate::{
    relay::{RelayConfig, RelayConnection},
    server::static_files::SpaConfig,
};

pub mod relay;
pub mod server;

struct AppState {
    // need to hold onto a reference to prevent the interface from being destroyed
    #[allow(unused)]
    relay_connection: RelayConnection,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();

    let relay_config = RelayConfig {
        address_range: "10.8.0.0/24".into(),
        ip_address: "10.8.0.2".into(),
        private_key: "<your private key>".into(),
        relay_endpoint: "<relay IP or DNS>".into(),
        relay_public_key: "<relay public key>".into(),
    };
    let relay_connection = relay::connect(&relay_config).unwrap();

    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(move |app| {
            let state = AppState { relay_connection };
            app.manage(Mutex::new(state));

            let server_config = SpaConfig {
                host: format!("{}:{}", &relay_config.ip_address, 3000),
                path: app.path().resolve("app/", BaseDirectory::Resource).unwrap(),
            };
            async_runtime::spawn(async move {
                server::static_files::serve_spa(&server_config)
                    .await
                    .unwrap();
            });
            Ok(())
        });

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
