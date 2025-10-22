import { SiteList } from './SiteList';

export function SiteListManager({ blacklist, onBlacklistChange, currentSite }) {
  return (
    <div className="site-list-manager">
      <h2 className="site-list-manager-title">
        Blacklisted Sites
      </h2>
      <p className="site-list-description">
        Sites in the blacklist will never have the dark theme applied, even when globally enabled.
      </p>

      <SiteList
        type="blacklist"
        sites={blacklist}
        onSitesChange={onBlacklistChange}
        currentSite={currentSite}
      />
    </div>
  );
}
