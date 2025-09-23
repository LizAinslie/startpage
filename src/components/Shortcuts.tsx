import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { FC } from "react";

import {
  faCloudflare,
  faDiscord,
  faGithub,
  faTwitch,
  faTwitter,
  faYoutube,
  faLastfm,
  faStackOverflow,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/shortcuts.scss";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

type Shortcut = {
  name: string;
  icon: IconDefinition;
  url: string;
};

const SHORTCUTS: Shortcut[] = [
  { name: "github", icon: faGithub, url: "https://github.com" },
  { name: "twitter", icon: faTwitter, url: "https://twitter.com" },
  { name: "twitch", icon: faTwitch, url: "https://twitch.tv" },
  { name: "youtube", icon: faYoutube, url: "https://youtube.com" },
  { name: "discord", icon: faDiscord, url: "https://discord.com" },
  {
    name: "cloudflare",
    icon: faCloudflare,
    url: "https://dash.cloudflare.com",
  },
  {
    name: "lastfm",
    icon: faLastfm,
    url: "https://last.fm",
  },
  {
    name: "spotify",
    icon: faSpotify,
    url: "https://open.spotify.com",
  },
  {
    name: "stackoverflow",
    icon: faStackOverflow,
    url: "https://stackoverflow.com",
  },
  {
    name: "gmail",
    icon: faEnvelope,
    url: "https://mail.google.com",
  },
];

const Shortcuts: FC = () => {
  return (
    <div className="shortcuts">
      {SHORTCUTS.map(({ name, icon, url }) => (
        <a
          key={name}
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          className={`shortcut ${name}`}
        >
          <FontAwesomeIcon icon={icon} />
        </a>
      ))}
    </div>
  );
};

export default Shortcuts;
