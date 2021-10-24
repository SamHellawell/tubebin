export default function AboutText() {
  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500">
        tubebin indexes YouTube videos from across the web and allows you to search, get suggestions and pick random videos.
      </p>
      <br />
      <p className="text-sm text-gray-500">
        The motivation behind the project is that we believe YouTube does not offer a fair search or suggestion algorithm anymore.
      </p>
      <br />
      <p className="text-sm text-gray-500">
        Many videos are artifically boosted by YouTube to increase revenue, non advertiser friendly content is often put at the end of searches
        and rarely appears on suggestions. Related videos are almost a thing of the past, we miss how easy it used to be to find content.
      </p>
      <br />
      <p className="text-sm text-gray-500">
        We offer a free anonymous search and suggestions service. No data is collected about you <strong>at all</strong>.
        It is currently in beta, feel free to report any bugs or issues you may find at <a
          href="https://github.com/SamHellawell/tubebin"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>.
      </p>
    </div>
  );
}
