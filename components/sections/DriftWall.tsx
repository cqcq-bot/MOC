const driftTiles = [
  { source: "/assets/moc-person-original.png", tone: "drift-tile-espresso" },
  { source: "/assets/moc-logo-original.png", tone: "drift-tile-copper" },
  { source: "/assets/moc-person-original.png", tone: "drift-tile-olive" },
  { source: "/assets/moc-logo-original.png", tone: "drift-tile-walnut" },
  { source: "/assets/moc-person-original.png", tone: "drift-tile-copper" },
  { source: "/assets/moc-logo-original.png", tone: "drift-tile-espresso" }
];

function DriftSet() {
  return (
    <div className="drift-set">
      {driftTiles.map((tile, index) => (
        <div className={`drift-tile ${tile.tone}`} key={`${tile.source}-${index}`}>
          <img src={tile.source} alt="" />
          <span aria-hidden="true">MOC / 0{(index % 3) + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function DriftWall() {
  return (
    <div className="drift-wall" aria-hidden="true">
      <div className="drift-track drift-track-forward">
        <DriftSet />
        <DriftSet />
      </div>
      <div className="drift-track drift-track-reverse">
        <DriftSet />
        <DriftSet />
      </div>
    </div>
  );
}
