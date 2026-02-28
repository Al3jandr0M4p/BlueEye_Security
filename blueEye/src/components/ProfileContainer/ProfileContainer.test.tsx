import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "./ProfileContainer";
import { useAppSelector } from "../../hooks/use-store-hook";

vi.mock("../../hooks/use-store-hook", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("../../helpers/roleComponentMap", () => ({
  default: {
    usuario: () => <div>User Profile Mock</div>,
    tecnico: () => <div>Tech Profile Mock</div>,
    admin: () => <div>Admin Profile Mock</div>,
    superAdmin: () => <div>Super Admin Profile Mock</div>,
  },
}));

const mockedUseAppSelector = vi.mocked(useAppSelector);

describe("ProfileContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders role component when profile exists", () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector({
        auth: {
          profile: {
            rolename: "tecnico",
            username: "john",
          },
        },
      } as never),
    );

    render(<ProfilePage />);
    expect(screen.getByText("Tech Profile Mock")).toBeInTheDocument();
  });

  it("renders nothing when there is no profile", () => {
    mockedUseAppSelector.mockImplementation((selector) =>
      selector({
        auth: {
          profile: null,
        },
      } as never),
    );

    const { container } = render(<ProfilePage />);
    expect(container).toBeEmptyDOMElement();
  });
});
