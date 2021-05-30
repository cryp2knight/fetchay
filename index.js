export const GET = "GET";
export const POST = "POST";
export const PATCH = "PATCH";
export const PUT = "PUT";
export const DELETE = "DELETE";

export class NotSupported extends Error {
  constructor(message = "Not supported") {
    super(message);
    this.code = "not_supported";
  }
}

export class InvalidType extends Error {
  constructor(message = "Invalid type") {
    super(message);
    this.code = "invalid_type";
  }
}

export function _toJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function _toURLQuery(params) {
  if (typeof params !== "object") {
    throw new InvalidType("params should be an key-pair object");
  }
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

export function _decodeURL(
  url = "",
  { query, hash = "", hasTrailingSlash = true }
) {
  const originalUrl = url;
  const [path, __query] = url.split("?");
  let [_query, _hash] = __query?.split("#") || [];
  const lastURLCharIndex = path.length - 1;
  if (hasTrailingSlash) {
    url = path.charAt(lastURLCharIndex) === "/" ? path : `${path}/`;
  } else {
    url =
      path.charAt(lastURLCharIndex) === "/"
        ? path.slice(0, lastURLCharIndex)
        : path;
  }
  if (query) {
    query = _toURLQuery(query);
    // overrides default query from original url
    url = `${url}?${query}`;
    _query = "";
  }
  if (_query) {
    url = `${url}?${_query}`;
  }
  if (hash) {
    // overrides default hash from original url
    url = `${url}#${hash}`;
    _hash = "";
  }
  if (_hash) {
    url = `${url}#${_hash}`;
  }
  return {
    hasTrailingSlash,
    originalUrl,
    fullURL: url,
    query: query || _query,
    hash: hash || _hash,
  };
}

export function _fetch(data) {
  if (!window.fetch) {
    throw new NotSupported();
  }
  let { url, method, body, headers } = data;

  if (typeof url === "string") {
    url = _decodeURL(url, {}).fullURL;
  } else if (typeof url === "object") {
    url = _decodeURL(url.url, url).fullURL;
  }

  headers = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    })
      .then(async (resp) => {
        const textResponse = await resp.text();
        return {
          ok: resp.ok,
          status: resp.status,
          url: resp.url,
          data: _toJSON(textResponse),
          statusText: resp.statusText,
          headers: resp.headers,
        };
      })
      .then((vals) => {
        if (vals.ok) {
          resolve(vals);
        } else {
          reject(resolve(vals));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function get(url, args) {
  return _fetch({ url, ...(args || {}), method: GET });
}

export function post(url, args) {
  return _fetch({ url, ...(args || {}), method: POST });
}

export function put(url, args) {
  return _fetch({ url, ...(args || {}), method: PUT });
}

export function patch(url, args) {
  return _fetch({ url, ...(args || {}), method: PATCH });
}

export function delete_(url, args) {
  return _fetch({ url, ...(args || {}), method: DELETE });
}
