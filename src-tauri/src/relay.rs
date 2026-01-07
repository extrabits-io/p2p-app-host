use std::{net::SocketAddr, str::FromStr};

use defguard_wireguard_rs::{host::Peer, key::Key, net::IpAddrMask, InterfaceConfiguration};
use defguard_wireguard_rs::{WGApi, WireguardInterfaceApi};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct RelayConfig {
    pub relay_public_key: String,
    pub relay_endpoint: String,
    pub address_range: String,
    pub private_key: String,
    pub ip_address: String,
}

pub fn connect(config: &RelayConfig) -> anyhow::Result<()> {
    let ifname: String = if cfg!(target_os = "linux") || cfg!(target_os = "freebsd") {
        "wg0".into()
    } else {
        "utun3".into()
    };

    #[cfg(not(target_os = "macos"))]
    let mut wgapi = WGApi::<defguard_wireguard_rs::Kernel>::new(ifname.clone())?;
    #[cfg(target_os = "macos")]
    let mut wgapi = WGApi::<defguard_wireguard_rs::Userspace>::new(ifname.clone())?;

    wgapi.create_interface()?;

    let peer_key = Key::from_str(&config.relay_public_key)?;
    let mut peer = Peer::new(peer_key.clone());

    let endpoint: SocketAddr = config.relay_endpoint.parse().unwrap();
    peer.endpoint = Some(endpoint);
    peer.persistent_keepalive_interval = Some(25);
    peer.allowed_ips
        .push(IpAddrMask::from_str(&config.address_range)?);

    // interface configuration
    let interface_config = InterfaceConfiguration {
        name: ifname,
        prvkey: config.private_key.clone(),
        addresses: vec![config.ip_address.parse().unwrap()],
        port: 0,
        peers: vec![peer],
        mtu: None,
    };

    #[cfg(not(windows))]
    wgapi.configure_interface(&interface_config)?;
    #[cfg(windows)]
    wgapi.configure_interface(&interface_config, &[], &[])?;
    wgapi.configure_peer_routing(&interface_config.peers)?;

    Ok(())
}
