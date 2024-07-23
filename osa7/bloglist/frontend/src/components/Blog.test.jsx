import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import blogService from "./../services/blogs";
import { vi } from "vitest";

const BLOG = {
  title: "Testauksen perusteet",
  author: "Teemu Teekkari",
  url: "testaus.test",
  likes: 19,
  user: {
    username: "teekkari",
    name: "Teemu Teekkari",
    id: "669c05f1c93fcd7d30703421",
  },
  id: "669c1020204c02f017fb0ee6",
};

const USER = {
  username: "teekkari",
  name: "Teemu Teekkari",
  id: "669c05f1c93fcd7d30703421",
};

test("Blog element renders title and author", () => {
  render(<Blog blog={BLOG} />);

  const element = screen.queryByText(`${BLOG.title} by ${BLOG.author} `);

  expect(element).toBeDefined();
});

test("Blog element does not render url", () => {
  render(<Blog blog={BLOG} />);

  const element = screen.queryByText(`${BLOG.url}`);

  expect(element).toBeNull();
});

test("Blog element does not render likes", () => {
  render(<Blog blog={BLOG} />);

  const element = screen.queryByText(`likes ${BLOG.likes}`);

  expect(element).toBeNull();
});

test("Blog element renders also url, likes and author once view button is toggled", async () => {
  render(<Blog blog={BLOG} user={USER} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const urlElement = screen.queryByText(`${BLOG.url}`);
  const likesElement = screen.queryByText(`${BLOG.url}`);
  const userElement = screen.queryByText(`${BLOG.user.name}`);

  expect(urlElement).toBeDefined();
  expect(likesElement).toBeDefined();
  expect(userElement).toBeDefined();
});

test("Clicking twice like button in Blog element calls handler function twice", async () => {
  const mockSetBlogs = vi.fn();
  const mockShowNotification = vi.fn();

  vi.spyOn(blogService, "updateBlog").mockResolvedValue({
    title: "Testauksen perusteet",
    author: "Teemu Teekkari",
    url: "testaus.test",
    likes: 20,
    user: {
      username: "teekkari",
      name: "Teemu Teekkari",
      id: "669c05f1c93fcd7d30703421",
    },
    id: "669c1020204c02f017fb0ee6",
  });

  render(
    <Blog
      blog={BLOG}
      user={USER}
      setBlogs={mockSetBlogs}
      showNotification={mockShowNotification}
    />,
  );

  const user = userEvent.setup();
  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  await waitFor(() => {
    expect(blogService.updateBlog.mock.calls).toHaveLength(2);
    expect(mockSetBlogs.mock.calls).toHaveLength(2);
    expect(mockShowNotification.mock.calls).toHaveLength(2);
  });
});
