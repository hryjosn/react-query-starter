import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./App.css";
const posts = [
  { id: "1", title: "Hello World" },
  { id: "2", title: "Foo Bar" },
];
function App() {
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => wait(1000).then(() => posts),
    // queryFn:()=> Promise.reject(new Error('Error Message'))
  });
  const newPostMutation = useMutation({
    mutationFn: (title: string) =>
      wait(1000).then(() => posts.push({ id: crypto.randomUUID(), title })),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const queryClient = useQueryClient();

  if (postQuery.isLoading) return <div>Loading...</div>;
  if (postQuery.isError) return <pre>{JSON.stringify(postQuery.error)}</pre>;
  return (
    <div>
      <h1>TanStankQuery</h1>
      <div>
        {postQuery.data?.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
      <button
        disabled={newPostMutation.isLoading}
        onClick={() => {
          newPostMutation.mutate("New Post");
        }}
      >
        Add new Post
      </button>
    </div>
  );
}

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
export default App;
