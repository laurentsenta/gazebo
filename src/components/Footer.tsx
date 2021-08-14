import { ToggleReleaseMode } from "@gazebo/release";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <ToggleReleaseMode />
      <div className="has-text-centered">
        <div className="author-links">
          <div className="columns is-size-1 p-4">
            <div className="column">
              <a
                href="https://www.twitter.com/laurentsenta"
                rel="nofollow noreferrer"
                target="_blank"
                title="twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
            <div className="column">
              <a
                href="https://www.laurentsenta.com"
                rel="nofollow noreferrer"
                target="_blank"
                title="website"
              >
                <i className="fad fa-seedling"></i>
              </a>
            </div>
            <div className="column">
              <a
                href="https://www.linkedin.com/in/laurentsenta"
                rel="nofollow noreferrer"
                target="_blank"
                title="linkedin"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>
            © 2021{" "}
            <a
              href="https://www.singulargarden.com"
              target="_blank"
              rel="noreferrer"
            >
              SingularGarden
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
