import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AddNewBlog from "./AddNewBlog";
import userEvent from "@testing-library/user-event";
import blogService from "./../services/blogs";
import { expect, vi } from "vitest";

test("AddNewBlog component adds new blog and calls the event handler it received as props", async () => {
  const user = userEvent.setup();
  const mockSetBlogs = vi.fn();
  const mockShowNotification = vi.fn();
  const mockShowAddBlog = vi.fn();

  vi.spyOn(blogService, "createBlog").mockResolvedValue({
    title: "title",
    author: "author",
    url: "www.testurl.com",
    likes: 0,
    user: {
      username: "teekkari",
      name: "Teemu Teekkari",
      id: "669c05f1c93fcd7d30703421",
    },
    id: "669c1020204c02f017fb0ee6",
  });

  render(
    <AddNewBlog
      setBlogs={mockSetBlogs}
      showNotification={mockShowNotification}
      setShowAddBlog={mockShowAddBlog}
    />,
  );

  const titleInput = screen.getByPlaceholderText("Blog title");
  const authorInput = screen.getByPlaceholderText("Blog author");
  const urlInput = screen.getByPlaceholderText("Blog url");
  const sendButton = screen.getByText("Submit");

  await user.type(titleInput, "title");
  await user.type(authorInput, "author");
  await user.type(urlInput, "www.testurl.com");
  await user.click(sendButton);

  await waitFor(() => {
    expect(blogService.createBlog.mock.calls).toHaveLength(1);
    expect(blogService.createBlog.mock.calls[0][0].title).toBe("title");
    expect(blogService.createBlog.mock.calls[0][0].author).toBe("author");
    expect(blogService.createBlog.mock.calls[0][0].url).toBe("www.testurl.com");
    expect(mockSetBlogs.mock.calls).toHaveLength(1);
    expect(mockShowNotification.mock.calls).toHaveLength(1);
    expect(mockShowAddBlog.mock.calls).toHaveLength(1);
  });
});
