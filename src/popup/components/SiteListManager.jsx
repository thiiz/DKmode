import { SiteList } from './SiteList';

export function SiteListManager({ whitelist, blacklist, onWhitelistChange, onBlacklistChange, currentSite }) {
  return (
    <div className="site-list-manager">
      <h2 className="site-list-manager-title">
        Site Management
      </h2>

      <SiteList
        type="whitelist"
        sites={whitelist}
        onSitesChange={onWhitelistChange}
        currentSite={currentSite}
      />

      <SiteList
        type="blacklist"
        sites={blacklist}
        onSitesChange={onBlacklistChange}
        currentSite={currentSite}
      />
    </div>
  );
}
