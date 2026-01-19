use std::{net::SocketAddr, str::FromStr};

use defguard_wireguard_rs::{host::Peer, key::Key, net::IpAddrMask, InterfaceConfiguration};
use defguard_wireguard_rs::{WGApi, WireguardInterfaceApi};
use serde::Deserialize;

#[derive(Clone, Deserialize)]
pub struct RelayConfig {
    pub relay_public_key: String,
    pub relay_endpoint: String,
    pub address_range: String,
    pub private_key: String,
    pub ip_address: String,
}

pub struct RelayConnection {
    #[cfg(not(target_os = "macos"))]
    #[allow(unused)]
    wgapi: WGApi<defguard_wireguard_rs::Kernel>,
    #[cfg(target_os = "macos")]
    #[allow(unused)]
    wgapi: WGApi<defguard_wireguard_rs::Userspace>,
}

pub fn connect(config: &RelayConfig) -> anyhow::Result<RelayConnection> {
    let ifname: String = if cfg!(target_os = "linux") || cfg!(target_os = "freebsd") {
        "wg0".into()
    } else {
        "utun6".into() // TODO - test for available interface name
    };

    #[cfg(not(target_os = "macos"))]
    let mut wgapi = WGApi::<defguard_wireguard_rs::Kernel>::new(ifname.clone())?;
    #[cfg(target_os = "macos")]
    let mut wgapi = WGApi::<defguard_wireguard_rs::Userspace>::new(ifname.clone())?;

    wgapi.create_interface()?;

    let peer_key = Key::from_str(&config.relay_public_key)?;
    let mut peer = Peer::new(peer_key.clone());

    let endpoint: SocketAddr = config.relay_endpoint.parse()?;
    peer.endpoint = Some(endpoint);
    peer.persistent_keepalive_interval = Some(25);
    peer.allowed_ips
        .push(IpAddrMask::from_str(&config.address_range)?);

    let interface_config = InterfaceConfiguration {
        name: ifname,
        prvkey: config.private_key.clone(),
        addresses: vec![config.ip_address.parse()?],
        port: 0,
        peers: vec![peer],
        mtu: None,
    };

    #[cfg(not(windows))]
    wgapi.configure_interface(&interface_config)?;
    #[cfg(windows)]
    wgapi.configure_interface(&interface_config, &[], &[])?;

    wgapi.configure_peer_routing(&interface_config.peers)?;

    Ok(RelayConnection { wgapi })
}
