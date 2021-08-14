import React from "react";

interface IImageProp {
  url: string;
  width: number;
  height?: number;
}

interface IProps {
  title?: string;
  pageURL?: string;
  description?: string;
  site?: string;
  creator?: string;
  type?: string;
  images?: IImageProp[];
  card?: string;
}

const AMeta: React.FC<{
  property?: string;
  name?: string;
  content?: string;
}> = ({ property, name, content }) => {
  if (!content) {
    return null;
  }
  if (property) {
    return <meta property={property} content={content} />;
  }
  if (name) {
    return <meta name={name} content={content} />;
  }

  console.error("missing property / name field");
  return null;
};

export const SocialCardsMeta: React.FC<IProps> = ({
  title,
  pageURL,
  description,
  site,
  creator,
  type,
  images,
  card,
}) => {
  return (
    <>
      <AMeta property="og:title" content={title} />
      <AMeta property="og:url" content={pageURL} />
      <AMeta property="og:description" content={description} />
      <AMeta property="og:type" content={type || "website"} />

      {images
        ? images.map((image, id) => (
          <React.Fragment key={id}>
            <meta property="og:image" content={image.url} />
            <meta property="og:image:width" content={`${image.width}`} />
            <meta
              property="og:image:height"
              content={`${image.height || image.width}`}
            />
          </React.Fragment>
        ))
        : null}

      <AMeta name="twitter:title" content={title} />
      <AMeta name="twitter:description" content={description} />
      <AMeta name="twitter:site" content={site} />
      <AMeta name="twitter:creator" content={creator} />
      <AMeta name="twitter:card" content={card || "summary_large_image"} />

      {images && images.length > 0 ? (
        <meta name="twitter:image" content={images[0].url} />
      ) : null}
    </>
  );
};
