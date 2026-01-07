use tauri::{async_runtime, path::BaseDirectory, Manager};

use crate::{relay::RelayConfig, server::static_files::SpaConfig};

pub mod relay;
pub mod server;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let relay_config = RelayConfig {
        address_range: "10.8.0.0/24".into(),
        ip_address: "10.8.0.2".into(),
        private_key: "<your private key>".into(),
        relay_endpoint: "<relay IP or DNS>".into(),
        relay_public_key: "<relay public key>".into(),
    };

    env_logger::init();
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(move |app| {
            let server_config = SpaConfig {
                host: format!("{}:{}", relay_config.ip_address.clone(), 3000),
                path: app.path().resolve("app/", BaseDirectory::Resource).unwrap(),
            };
            async_runtime::spawn(async move {
                relay::connect(&relay_config).unwrap();
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
