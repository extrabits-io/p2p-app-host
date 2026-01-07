use std::{net::SocketAddr, path::PathBuf, str::FromStr};

use axum::Router;
use tower_http::services::{ServeDir, ServeFile};

#[derive(Clone)]
pub struct SpaConfig {
    pub host: String,
    pub path: PathBuf,
}

pub async fn serve_spa(config: &SpaConfig) -> anyhow::Result<()> {
    let addr = SocketAddr::from_str(&config.host)?;
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    let serve_index = ServeFile::new(&config.path.join("index.html"));
    let serve_dir = ServeDir::new(&config.path).not_found_service(serve_index);
    let router = Router::new().fallback_service(serve_dir);
    log::info!(
        "serving {:?} on {}",
        &config.path,
        listener.local_addr().unwrap()
    );
    axum::serve(listener, router).await?;
    Ok(())
}
