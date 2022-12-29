export function ipfsGateway(ipfsUrl: string) {
  return `https://cloudflare-ipfs.com/ipfs/${ipfsUrl.replace("ipfs://", "")}`;
}
