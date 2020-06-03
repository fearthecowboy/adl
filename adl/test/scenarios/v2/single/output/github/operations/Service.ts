export interface Service {
    /**
     * @description Lists all the emojis available to use on GitHub.
     * @http GET /emojis
     * @since v3
     */
    emojis(Accept?: Http.Header<string>);
    /**
     * @description List public events.
     * @http GET /events
     * @since v3
     */
    events(Accept?: Http.Header<string>);
    /**
     * @description List Feeds.
     * GitHub provides several timeline resources in Atom format. The Feeds API
     *  lists all the feeds available to the authenticating user.
     * @http GET /feeds
     * @since v3
     */
    feeds(Accept?: Http.Header<string>);
    /**
     * @description List the authenticated user's gists or if called anonymously, this will
     * return all public gists.
     * @http GET /gists
     * @since v3
     */
    gists(since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a gist.
     * @http POST /gists
     * @since v3
     */
    gists1(Accept?: Http.Header<string>);
    /**
     * @description List all public gists.
     * @http GET /gists/public
     * @since v3
     */
    public(since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description List the authenticated user's starred gists.
     * @http GET /gists/starred
     * @since v3
     */
    starred(since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single gist.
     * @http GET /gists/{id}
     * @since v3
     */
    gists2(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a gist.
     * @http DELETE /gists/{id}
     * @since v3
     */
    gists3(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit a gist.
     * @http PATCH /gists/{id}
     * @since v3
     */
    gists4(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List comments on a gist.
     * @http GET /gists/{id}/comments
     * @since v3
     */
    comments(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Create a commen
     * @http POST /gists/{id}/comments
     * @since v3
     */
    comments1(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get a single comment.
     * @http GET /gists/{id}/comments/{commentId}
     * @since v3
     */
    comments2(id: Http.Path<int64>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a comment.
     * @http DELETE /gists/{id}/comments/{commentId}
     * @since v3
     */
    comments3(id: Http.Path<int64>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit a comment.
     * @http PATCH /gists/{id}/comments/{commentId}
     * @since v3
     */
    comments4(id: Http.Path<int64>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Fork a gist.
     * @http POST /gists/{id}/forks
     * @since v3
     */
    forks(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Check if a gist is starred.
     * @http GET /gists/{id}/star
     * @since v3
     */
    star(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Star a gist.
     * @http PUT /gists/{id}/star
     * @since v3
     */
    star1(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Unstar a gist.
     * @http DELETE /gists/{id}/star
     * @since v3
     */
    star2(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Listing available templates.
     * List all templates available to pass as an option when creating a repository.
     * @http GET /gitignore/templates
     * @since v3
     */
    templates(Accept?: Http.Header<string>);
    /**
     * @description Get a single template.
     * @http GET /gitignore/templates/{language}
     * @since v3
     */
    templates1(language: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List issues.
     * List all issues across all the authenticated user's visible repositories.
     * @http GET /issues
     * @since v3
     */
    issues(filter: Http.Query<"assigned" | "created" | "mentioned" | "subscribed" | "all">, state: Http.Query<"open" | "closed">, labels: Http.Query<string>, sort: Http.Query<"created" | "updated" | "comments">, direction: Http.Query<"asc" | "desc">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Find issues by state and keyword.
     * @http GET /legacy/issues/search/{owner}/{repository}/{state}/{keyword}
     * @deprecated v3
     * @since v3
     */
    search(keyword: Http.Path<string>, state: Http.Path<"open" | "closed">, owner: Http.Path<string>, repository: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Find repositories by keyword. Note, this legacy method does not follow the v3 pagination pattern. This method returns up to 100 results per page and pages can be fetched using the start_page parameter.
     * @http GET /legacy/repos/search/{keyword}
     * @deprecated v3
     * @since v3
     */
    search1(keyword: Http.Path<string>, order?: Http.Query<"desc" | "asc">, language?: Http.Query<string>, start_page?: Http.Query<string>, sort?: Http.Query<"updated" | "stars" | "forks">, Accept?: Http.Header<string>);
    /**
     * @description This API call is added for compatibility reasons only.
     * @http GET /legacy/user/email/{email}
     * @deprecated v3
     * @since v3
     */
    email(email: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Find users by keyword.
     * @http GET /legacy/user/search/{keyword}
     * @deprecated v3
     * @since v3
     */
    search2(keyword: Http.Path<string>, order?: Http.Query<"desc" | "asc">, start_page?: Http.Query<string>, sort?: Http.Query<"updated" | "stars" | "forks">, Accept?: Http.Header<string>);
    /**
     * @description Render an arbitrary Markdown document
     * @http POST /markdown
     * @since v3
     */
    markdown(Accept?: Http.Header<string>);
    /**
     * @description Render a Markdown document in raw mode
     * @http POST /markdown/raw
     * @since v3
     */
    raw(Accept?: Http.Header<string>);
    /**
     * @description This gives some information about GitHub.com, the service.
     * @http GET /meta
     * @since v3
     */
    meta(Accept?: Http.Header<string>);
    /**
     * @description List public events for a network of repositories.
     * @http GET /networks/{owner}/{repo}/events
     * @since v3
     */
    events1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List your notifications.
     * List all notifications for the current user, grouped by repository.
     * @http GET /notifications
     * @since v3
     */
    notifications(all?: Http.Query<boolean>, participating?: Http.Query<boolean>, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Mark as read.
     * Marking a notification as "read" removes it from the default view on GitHub.com.
     * @http PUT /notifications
     * @since v3
     */
    notifications1(Accept?: Http.Header<string>);
    /**
     * @description View a single thread.
     * @http GET /notifications/threads/{id}
     * @since v3
     */
    threads(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Mark a thread as read
     * @http PATCH /notifications/threads/{id}
     * @since v3
     */
    threads1(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get a Thread Subscription.
     * @http GET /notifications/threads/{id}/subscription
     * @since v3
     */
    subscription(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Set a Thread Subscription.
     * This lets you subscribe to a thread, or ignore it. Subscribing to a thread
     * is unnecessary if the user is already subscribed to the repository. Ignoring
     * a thread will mute all future notifications (until you comment or get @mentioned).
     * @http PUT /notifications/threads/{id}/subscription
     * @since v3
     */
    subscription1(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a Thread Subscription.
     * @http DELETE /notifications/threads/{id}/subscription
     * @since v3
     */
    subscription2(id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get an Organization.
     * @http GET /orgs/{org}
     * @since v3
     */
    orgs(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Edit an Organization.
     * @http PATCH /orgs/{org}
     * @since v3
     */
    orgs1(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List public events for an organization.
     * @http GET /orgs/{org}/events
     * @since v3
     */
    events2(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List issues.
     * List all issues for a given organization for the authenticated user.
     * @http GET /orgs/{org}/issues
     * @since v3
     */
    issues1(org: Http.Path<string>, filter: Http.Query<"assigned" | "created" | "mentioned" | "subscribed" | "all">, state: Http.Query<"open" | "closed">, labels: Http.Query<string>, sort: Http.Query<"created" | "updated" | "comments">, direction: Http.Query<"asc" | "desc">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Members list.
     * List all users who are members of an organization. A member is a user tha
     * belongs to at least 1 team in the organization. If the authenticated user
     * is also an owner of this organization then both concealed and public members
     * will be returned. If the requester is not an owner of the organization the
     * query will be redirected to the public members list.
     * @http GET /orgs/{org}/members
     * @since v3
     */
    members(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Check if a user is, publicly or privately, a member of the organization.
     * @http GET /orgs/{org}/members/{username}
     * @since v3
     */
    members1(org: Http.Path<string>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Remove a member.
     * Removing a user from this list will remove them from all teams and they
     * will no longer have any access to the organization's repositories.
     * @http DELETE /orgs/{org}/members/{username}
     * @since v3
     */
    members2(org: Http.Path<string>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Public members list.
     * Members of an organization can choose to have their membership publicized
     * or not.
     * @http GET /orgs/{org}/public_members
     * @since v3
     */
    public_members(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Check public membership.
     * @http GET /orgs/{org}/public_members/{username}
     * @since v3
     */
    public_members1(org: Http.Path<string>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Publicize a user's membership.
     * @http PUT /orgs/{org}/public_members/{username}
     * @since v3
     */
    public_members2(org: Http.Path<string>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Conceal a user's membership.
     * @http DELETE /orgs/{org}/public_members/{username}
     * @since v3
     */
    public_members3(org: Http.Path<string>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List repositories for the specified org.
     * @http GET /orgs/{org}/repos
     * @since v3
     */
    repos(org: Http.Path<string>, type?: Http.Query<"all" | "public" | "private" | "forks" | "sources" | "member">, Accept?: Http.Header<string>);
    /**
     * @description Create a new repository for the authenticated user. OAuth users must supply
     * repo scope.
     * @http POST /orgs/{org}/repos
     * @since v3
     */
    repos1(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List teams.
     * @http GET /orgs/{org}/teams
     * @since v3
     */
    teams(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create team.
     * In order to create a team, the authenticated user must be an owner of organization.
     * @http POST /orgs/{org}/teams
     * @since v3
     */
    teams1(org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get your current rate limit status
     * Note: Accessing this endpoint does not count against your rate limit.
     * @http GET /rate_limit
     * @since v3
     */
    rate_limit(Accept?: Http.Header<string>);
    /**
     * @description Get repository.
     * @http GET /repos/{owner}/{repo}
     * @since v3
     */
    repos2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a Repository.
     * Deleting a repository requires admin access. If OAuth is used, the delete_repo
     * scope is required.
     * @http DELETE /repos/{owner}/{repo}
     * @since v3
     */
    repos3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Edit repository.
     * @http PATCH /repos/{owner}/{repo}
     * @since v3
     */
    repos4(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List assignees.
     * This call lists all the available assignees (owner + collaborators) to which
     * issues may be assigned.
     * @http GET /repos/{owner}/{repo}/assignees
     * @since v3
     */
    assignees(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Check assignee.
     * You may also check to see if a particular user is an assignee for a repository.
     * @http GET /repos/{owner}/{repo}/assignees/{assignee}
     * @since v3
     */
    assignees1(owner: Http.Path<string>, repo: Http.Path<string>, assignee: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get list of branches
     * @http GET /repos/{owner}/{repo}/branches
     * @since v3
     */
    branches(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get Branch
     * @http GET /repos/{owner}/{repo}/branches/{branch}
     * @since v3
     */
    branches1(owner: Http.Path<string>, repo: Http.Path<string>, branch: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List.
     * When authenticating as an organization owner of an organization-owned
     * repository, all organization owners are included in the list of
     * collaborators. Otherwise, only users with access to the repository are
     * returned in the collaborators list.
     * @http GET /repos/{owner}/{repo}/collaborators
     * @since v3
     */
    collaborators(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Check if user is a collaborator
     * @http GET /repos/{owner}/{repo}/collaborators/{user}
     * @since v3
     */
    collaborators1(owner: Http.Path<string>, repo: Http.Path<string>, user: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Add collaborator.
     * @http PUT /repos/{owner}/{repo}/collaborators/{user}
     * @since v3
     */
    collaborators2(owner: Http.Path<string>, repo: Http.Path<string>, user: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Remove collaborator.
     * @http DELETE /repos/{owner}/{repo}/collaborators/{user}
     * @since v3
     */
    collaborators3(owner: Http.Path<string>, repo: Http.Path<string>, user: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List commit comments for a repository.
     * Comments are ordered by ascending ID.
     * @http GET /repos/{owner}/{repo}/comments
     * @since v3
     */
    comments5(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single commit comment.
     * @http GET /repos/{owner}/{repo}/comments/{commentId}
     * @since v3
     */
    comments6(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a commit comment
     * @http DELETE /repos/{owner}/{repo}/comments/{commentId}
     * @since v3
     */
    comments7(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Update a commit comment.
     * @http PATCH /repos/{owner}/{repo}/comments/{commentId}
     * @since v3
     */
    comments8(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List commits on a repository.
     * @http GET /repos/{owner}/{repo}/commits
     * @since v3
     */
    commits(owner: Http.Path<string>, repo: Http.Path<string>, since?: Http.Query<string>, sha?: Http.Query<string>, path?: Http.Query<string>, author?: Http.Query<string>, until?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the combined Status for a specific Ref
     * The Combined status endpoint is currently available for developers to preview. During the preview period, the API may change without advance notice. Please see the blog post for full details.
     * To access this endpoint during the preview period, you must provide a custom media type in the Accept header:
     * application/vnd.github.she-hulk-preview+json
     * @http GET /repos/{owner}/{repo}/commits/{ref}/status
     * @since v3
     */
    status(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single commit.
     * @http GET /repos/{owner}/{repo}/commits/{shaCode}
     * @since v3
     */
    commits1(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List comments for a single commitList comments for a single commit.
     * @http GET /repos/{owner}/{repo}/commits/{shaCode}/comments
     * @since v3
     */
    comments9(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a commit comment.
     * @http POST /repos/{owner}/{repo}/commits/{shaCode}/comments
     * @since v3
     */
    comments10(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Compare two commits
     * @http GET /repos/{owner}/{repo}/compare/{baseId}...{headId}
     * @since v3
     */
    '...'(owner: Http.Path<string>, repo: Http.Path<string>, baseId: Http.Path<string>, headId: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get contents.
     * This method returns the contents of a file or directory in a repository.
     * Files and symlinks support a custom media type for getting the raw content.
     * Directories and submodules do not support custom media types.
     * Note: This API supports files up to 1 megabyte in size.
     * Here can be many outcomes. For details see "http://developer.github.com/v3/repos/contents/"
     * @http GET /repos/{owner}/{repo}/contents/{path}
     * @since v3
     */
    contents(owner: Http.Path<string>, repo: Http.Path<string>, path: Http.Path<string>, path?: Http.Query<string>, ref?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a file.
     * @http PUT /repos/{owner}/{repo}/contents/{path}
     * @since v3
     */
    contents1(owner: Http.Path<string>, repo: Http.Path<string>, path: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a file.
     * This method deletes a file in a repository.
     * @http DELETE /repos/{owner}/{repo}/contents/{path}
     * @since v3
     */
    contents2(owner: Http.Path<string>, repo: Http.Path<string>, path: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get list of contributors.
     * @http GET /repos/{owner}/{repo}/contributors
     * @since v3
     */
    contributors(owner: Http.Path<string>, repo: Http.Path<string>, anon: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with pull access can view deployments for a repository
     * @http GET /repos/{owner}/{repo}/deployments
     * @since v3
     */
    deployments(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with push access can create a deployment for a given ref
     * @http POST /repos/{owner}/{repo}/deployments
     * @since v3
     */
    deployments1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with pull access can view deployment statuses for a deployment
     * @http GET /repos/{owner}/{repo}/deployments/{id}/statuses
     * @since v3
     */
    statuses(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Create a Deployment Status
     * Users with push access can create deployment statuses for a given deployment:
     * @http POST /repos/{owner}/{repo}/deployments/{id}/statuses
     * @since v3
     */
    statuses1(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Deprecated. List downloads for a repository.
     * @http GET /repos/{owner}/{repo}/downloads
     * @deprecated v3
     * @since v3
     */
    downloads(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Deprecated. Get a single download.
     * @http GET /repos/{owner}/{repo}/downloads/{downloadId}
     * @deprecated v3
     * @since v3
     */
    downloads1(owner: Http.Path<string>, repo: Http.Path<string>, downloadId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Deprecated. Delete a download.
     * @http DELETE /repos/{owner}/{repo}/downloads/{downloadId}
     * @deprecated v3
     * @since v3
     */
    downloads2(owner: Http.Path<string>, repo: Http.Path<string>, downloadId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get list of repository events.
     * @http GET /repos/{owner}/{repo}/events
     * @since v3
     */
    events3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List forks.
     * @http GET /repos/{owner}/{repo}/forks
     * @since v3
     */
    forks1(owner: Http.Path<string>, repo: Http.Path<string>, sort?: Http.Query<"newes" | "oldes" | "watchers">, Accept?: Http.Header<string>);
    /**
     * @description Create a fork.
     * Forking a Repository happens asynchronously. Therefore, you may have to wai
     * a short period before accessing the git objects. If this takes longer than 5
     * minutes, be sure to contact Support.
     * @http POST /repos/{owner}/{repo}/forks
     * @since v3
     */
    forks2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Blob.
     * @http POST /repos/{owner}/{repo}/git/blobs
     * @since v3
     */
    blobs(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Blob.
     * Since blobs can be any arbitrary binary data, the input and responses for
     * the blob API takes an encoding parameter that can be either utf-8 or
     * base64. If your data cannot be losslessly sent as a UTF-8 string, you can
     * base64 encode it.
     * @http GET /repos/{owner}/{repo}/git/blobs/{shaCode}
     * @since v3
     */
    blobs1(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Commit.
     * @http POST /repos/{owner}/{repo}/git/commits
     * @since v3
     */
    commits2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Commit.
     * @http GET /repos/{owner}/{repo}/git/commits/{shaCode}
     * @since v3
     */
    commits3(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get all References
     * @http GET /repos/{owner}/{repo}/git/refs
     * @since v3
     */
    refs(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Reference
     * @http POST /repos/{owner}/{repo}/git/refs
     * @since v3
     */
    refs1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Reference
     * @http GET /repos/{owner}/{repo}/git/refs/{ref}
     * @since v3
     */
    refs2(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a Reference
     * Example: Deleting a branch: DELETE /repos/octocat/Hello-World/git/refs/heads/feature-a
     * Example: Deleting a tag:        DELETE /repos/octocat/Hello-World/git/refs/tags/v1.0
     * @http DELETE /repos/{owner}/{repo}/git/refs/{ref}
     * @since v3
     */
    refs3(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Update a Reference
     * @http PATCH /repos/{owner}/{repo}/git/refs/{ref}
     * @since v3
     */
    refs4(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Tag Object.
     * Note that creating a tag object does not create the reference that makes a
     * tag in Git. If you want to create an annotated tag in Git, you have to do
     * this call to create the tag object, and then create the refs/tags/[tag]
     * reference. If you want to create a lightweight tag, you only have to create
     * the tag reference - this call would be unnecessary.
     * @http POST /repos/{owner}/{repo}/git/tags
     * @since v3
     */
    tags(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Tag.
     * @http GET /repos/{owner}/{repo}/git/tags/{shaCode}
     * @since v3
     */
    tags1(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Tree.
     * The tree creation API will take nested entries as well. If both a tree and
     * a nested path modifying that tree are specified, it will overwrite the
     * contents of that tree with the new path contents and write a new tree out.
     * @http POST /repos/{owner}/{repo}/git/trees
     * @since v3
     */
    trees(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Tree.
     * @http GET /repos/{owner}/{repo}/git/trees/{shaCode}
     * @since v3
     */
    trees1(owner: Http.Path<string>, repo: Http.Path<string>, shaCode: Http.Path<string>, recursive?: Http.Query<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get list of hooks.
     * @http GET /repos/{owner}/{repo}/hooks
     * @since v3
     */
    hooks(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a hook.
     * @http POST /repos/{owner}/{repo}/hooks
     * @since v3
     */
    hooks1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get single hook.
     * @http GET /repos/{owner}/{repo}/hooks/{hookId}
     * @since v3
     */
    hooks2(owner: Http.Path<string>, repo: Http.Path<string>, hookId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a hook.
     * @http DELETE /repos/{owner}/{repo}/hooks/{hookId}
     * @since v3
     */
    hooks3(owner: Http.Path<string>, repo: Http.Path<string>, hookId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit a hook.
     * @http PATCH /repos/{owner}/{repo}/hooks/{hookId}
     * @since v3
     */
    hooks4(owner: Http.Path<string>, repo: Http.Path<string>, hookId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Test a push hook.
     * This will trigger the hook with the latest push to the current repository
     * if the hook is subscribed to push events. If the hook is not subscribed
     * to push events, the server will respond with 204 but no test POST will
     * be generated.
     * Note: Previously /repos/:owner/:repo/hooks/:id/tes
     * @http POST /repos/{owner}/{repo}/hooks/{hookId}/tests
     * @since v3
     */
    tests(owner: Http.Path<string>, repo: Http.Path<string>, hookId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List issues for a repository.
     * @http GET /repos/{owner}/{repo}/issues
     * @since v3
     */
    issues2(owner: Http.Path<string>, repo: Http.Path<string>, filter: Http.Query<"assigned" | "created" | "mentioned" | "subscribed" | "all">, state: Http.Query<"open" | "closed">, labels: Http.Query<string>, sort: Http.Query<"created" | "updated" | "comments">, direction: Http.Query<"asc" | "desc">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Create an issue.
     * Any user with pull access to a repository can create an issue.
     * @http POST /repos/{owner}/{repo}/issues
     * @since v3
     */
    issues3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List comments in a repository.
     * @http GET /repos/{owner}/{repo}/issues/comments
     * @since v3
     */
    comments11(owner: Http.Path<string>, repo: Http.Path<string>, direction?: Http.Query<string>, sort?: Http.Query<"created" | "updated">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single comment.
     * @http GET /repos/{owner}/{repo}/issues/comments/{commentId}
     * @since v3
     */
    comments12(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a comment.
     * @http DELETE /repos/{owner}/{repo}/issues/comments/{commentId}
     * @since v3
     */
    comments13(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit a comment.
     * @http PATCH /repos/{owner}/{repo}/issues/comments/{commentId}
     * @since v3
     */
    comments14(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List issue events for a repository.
     * @http GET /repos/{owner}/{repo}/issues/events
     * @since v3
     */
    events4(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single event.
     * @http GET /repos/{owner}/{repo}/issues/events/{eventId}
     * @since v3
     */
    events5(owner: Http.Path<string>, repo: Http.Path<string>, eventId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get a single issue
     * @http GET /repos/{owner}/{repo}/issues/{number}
     * @since v3
     */
    issues4(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit an issue.
     * Issue owners and users with push access can edit an issue.
     * @http PATCH /repos/{owner}/{repo}/issues/{number}
     * @since v3
     */
    issues5(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List comments on an issue.
     * @http GET /repos/{owner}/{repo}/issues/{number}/comments
     * @since v3
     */
    comments15(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Create a comment.
     * @http POST /repos/{owner}/{repo}/issues/{number}/comments
     * @since v3
     */
    comments16(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List events for an issue.
     * @http GET /repos/{owner}/{repo}/issues/{number}/events
     * @since v3
     */
    events6(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List labels on an issue.
     * @http GET /repos/{owner}/{repo}/issues/{number}/labels
     * @since v3
     */
    labels(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Replace all labels for an issue.
     * Sending an empty array ([]) will remove all Labels from the Issue.
     * @http PUT /repos/{owner}/{repo}/issues/{number}/labels
     * @since v3
     */
    labels1(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Add labels to an issue.
     * @http POST /repos/{owner}/{repo}/issues/{number}/labels
     * @since v3
     */
    labels2(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Remove all labels from an issue.
     * @http DELETE /repos/{owner}/{repo}/issues/{number}/labels
     * @since v3
     */
    labels3(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Remove a label from an issue.
     * @http DELETE /repos/{owner}/{repo}/issues/{number}/labels/{name}
     * @since v3
     */
    labels4(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, name: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get list of keys.
     * @http GET /repos/{owner}/{repo}/keys
     * @since v3
     */
    keys(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a key.
     * @http POST /repos/{owner}/{repo}/keys
     * @since v3
     */
    keys1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a key
     * @http GET /repos/{owner}/{repo}/keys/{keyId}
     * @since v3
     */
    keys2(owner: Http.Path<string>, repo: Http.Path<string>, keyId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a key.
     * @http DELETE /repos/{owner}/{repo}/keys/{keyId}
     * @since v3
     */
    keys3(owner: Http.Path<string>, repo: Http.Path<string>, keyId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List all labels for this repository.
     * @http GET /repos/{owner}/{repo}/labels
     * @since v3
     */
    labels5(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a label.
     * @http POST /repos/{owner}/{repo}/labels
     * @since v3
     */
    labels6(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single label.
     * @http GET /repos/{owner}/{repo}/labels/{name}
     * @since v3
     */
    labels7(owner: Http.Path<string>, repo: Http.Path<string>, name: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a label.
     * @http DELETE /repos/{owner}/{repo}/labels/{name}
     * @since v3
     */
    labels8(owner: Http.Path<string>, repo: Http.Path<string>, name: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Update a label.
     * @http PATCH /repos/{owner}/{repo}/labels/{name}
     * @since v3
     */
    labels9(owner: Http.Path<string>, repo: Http.Path<string>, name: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List languages.
     * List languages for the specified repository. The value on the right of a
     * language is the number of bytes of code written in that language.
     * @http GET /repos/{owner}/{repo}/languages
     * @since v3
     */
    languages(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Perform a merge.
     * @http POST /repos/{owner}/{repo}/merges
     * @since v3
     */
    merges(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List milestones for a repository.
     * @http GET /repos/{owner}/{repo}/milestones
     * @since v3
     */
    milestones(owner: Http.Path<string>, repo: Http.Path<string>, state?: Http.Query<"open" | "closed">, direction?: Http.Query<string>, sort?: Http.Query<"due_date" | "completeness">, Accept?: Http.Header<string>);
    /**
     * @description Create a milestone.
     * @http POST /repos/{owner}/{repo}/milestones
     * @since v3
     */
    milestones1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single milestone.
     * @http GET /repos/{owner}/{repo}/milestones/{number}
     * @since v3
     */
    milestones2(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a milestone.
     * @http DELETE /repos/{owner}/{repo}/milestones/{number}
     * @since v3
     */
    milestones3(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Update a milestone.
     * @http PATCH /repos/{owner}/{repo}/milestones/{number}
     * @since v3
     */
    milestones4(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get labels for every issue in a milestone.
     * @http GET /repos/{owner}/{repo}/milestones/{number}/labels
     * @since v3
     */
    labels10(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List your notifications in a repository
     * List all notifications for the current user.
     * @http GET /repos/{owner}/{repo}/notifications
     * @since v3
     */
    notifications2(owner: Http.Path<string>, repo: Http.Path<string>, all?: Http.Query<boolean>, participating?: Http.Query<boolean>, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Mark notifications as read in a repository.
     * Marking all notifications in a repository as "read" removes them from the
     * default view on GitHub.com.
     * @http PUT /repos/{owner}/{repo}/notifications
     * @since v3
     */
    notifications3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List pull requests.
     * @http GET /repos/{owner}/{repo}/pulls
     * @since v3
     */
    pulls(owner: Http.Path<string>, repo: Http.Path<string>, state?: Http.Query<"open" | "closed">, head?: Http.Query<string>, base?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a pull request.
     * @http POST /repos/{owner}/{repo}/pulls
     * @since v3
     */
    pulls1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List comments in a repository.
     * By default, Review Comments are ordered by ascending ID.
     * @http GET /repos/{owner}/{repo}/pulls/comments
     * @since v3
     */
    comments17(owner: Http.Path<string>, repo: Http.Path<string>, direction?: Http.Query<string>, sort?: Http.Query<"created" | "updated">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single comment.
     * @http GET /repos/{owner}/{repo}/pulls/comments/{commentId}
     * @since v3
     */
    comments18(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a comment.
     * @http DELETE /repos/{owner}/{repo}/pulls/comments/{commentId}
     * @since v3
     */
    comments19(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit a comment.
     * @http PATCH /repos/{owner}/{repo}/pulls/comments/{commentId}
     * @since v3
     */
    comments20(owner: Http.Path<string>, repo: Http.Path<string>, commentId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get a single pull request.
     * @http GET /repos/{owner}/{repo}/pulls/{number}
     * @since v3
     */
    pulls2(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Update a pull request.
     * @http PATCH /repos/{owner}/{repo}/pulls/{number}
     * @since v3
     */
    pulls3(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List comments on a pull request.
     * @http GET /repos/{owner}/{repo}/pulls/{number}/comments
     * @since v3
     */
    comments21(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Create a comment.
     *   #TODO Alternative input ( http://developer.github.com/v3/pulls/comments/ )
     *   description: |
     *     Alternative Input.
     *     Instead of passing commit_id, path, and position you can reply to an
     *     existing Pull Request Comment like this:
     *
     *         body
     *            Required string
     *         in_reply_to
     *            Required number - Comment id to reply to.
     * @http POST /repos/{owner}/{repo}/pulls/{number}/comments
     * @since v3
     */
    comments22(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List commits on a pull request.
     * @http GET /repos/{owner}/{repo}/pulls/{number}/commits
     * @since v3
     */
    commits4(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List pull requests files.
     * @http GET /repos/{owner}/{repo}/pulls/{number}/files
     * @since v3
     */
    files(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get if a pull request has been merged.
     * @http GET /repos/{owner}/{repo}/pulls/{number}/merge
     * @since v3
     */
    merge(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Merge a pull request (Merge Button's)
     * @http PUT /repos/{owner}/{repo}/pulls/{number}/merge
     * @since v3
     */
    merge1(owner: Http.Path<string>, repo: Http.Path<string>, number: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get the README.
     * This method returns the preferred README for a repository.
     * @http GET /repos/{owner}/{repo}/readme
     * @since v3
     */
    readme(owner: Http.Path<string>, repo: Http.Path<string>, ref?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with push access to the repository will receive all releases (i.e., published releases and draft releases). Users with pull access will receive published releases only
     * @http GET /repos/{owner}/{repo}/releases
     * @since v3
     */
    releases(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a release
     * Users with push access to the repository can create a release.
     * @http POST /repos/{owner}/{repo}/releases
     * @since v3
     */
    releases1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single release asset
     * @http GET /repos/{owner}/{repo}/releases/assets/{id}
     * @since v3
     */
    assets(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a release asset
     * @http DELETE /repos/{owner}/{repo}/releases/assets/{id}
     * @since v3
     */
    assets1(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Edit a release asset
     * Users with push access to the repository can edit a release asset.
     * @http PATCH /repos/{owner}/{repo}/releases/assets/{id}
     * @since v3
     */
    assets2(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a single release
     * @http GET /repos/{owner}/{repo}/releases/{id}
     * @since v3
     */
    releases2(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with push access to the repository can delete a release.
     * @http DELETE /repos/{owner}/{repo}/releases/{id}
     * @since v3
     */
    releases3(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Users with push access to the repository can edit a release
     * @http PATCH /repos/{owner}/{repo}/releases/{id}
     * @since v3
     */
    releases4(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List assets for a release
     * @http GET /repos/{owner}/{repo}/releases/{id}/assets
     * @since v3
     */
    assets3(owner: Http.Path<string>, repo: Http.Path<string>, id: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List Stargazers.
     * @http GET /repos/{owner}/{repo}/stargazers
     * @since v3
     */
    stargazers(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the number of additions and deletions per week.
     * Returns a weekly aggregate of the number of additions and deletions pushed
     * to a repository.
     * @http GET /repos/{owner}/{repo}/stats/code_frequency
     * @since v3
     */
    code_frequency(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the last year of commit activity data.
     * Returns the last year of commit activity grouped by week. The days array
     * is a group of commits per day, starting on Sunday.
     * @http GET /repos/{owner}/{repo}/stats/commit_activity
     * @since v3
     */
    commit_activity(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get contributors list with additions, deletions, and commit counts.
     * @http GET /repos/{owner}/{repo}/stats/contributors
     * @since v3
     */
    contributors1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the weekly commit count for the repo owner and everyone else.
     * @http GET /repos/{owner}/{repo}/stats/participation
     * @since v3
     */
    participation(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the number of commits per hour in each day.
     * Each array contains the day number, hour number, and number of commits
     * 0-6 Sunday - Saturday
     * 0-23 Hour of day
     * Number of commits
     *
     * For example, [2, 14, 25] indicates that there were 25 total commits, during
     * the 2.00pm hour on Tuesdays. All times are based on the time zone of
     * individual commits.
     * @http GET /repos/{owner}/{repo}/stats/punch_card
     * @since v3
     */
    punch_card(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List Statuses for a specific Ref.
     * @http GET /repos/{owner}/{repo}/statuses/{ref}
     * @since v3
     */
    statuses2(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Create a Status.
     * @http POST /repos/{owner}/{repo}/statuses/{ref}
     * @since v3
     */
    statuses3(owner: Http.Path<string>, repo: Http.Path<string>, ref: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List watchers.
     * @http GET /repos/{owner}/{repo}/subscribers
     * @since v3
     */
    subscribers(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get a Repository Subscription.
     * @http GET /repos/{owner}/{repo}/subscription
     * @since v3
     */
    subscription3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Set a Repository Subscription
     * @http PUT /repos/{owner}/{repo}/subscription
     * @since v3
     */
    subscription4(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Delete a Repository Subscription.
     * @http DELETE /repos/{owner}/{repo}/subscription
     * @since v3
     */
    subscription5(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get list of tags.
     * @http GET /repos/{owner}/{repo}/tags
     * @since v3
     */
    tags2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get list of teams
     * @http GET /repos/{owner}/{repo}/teams
     * @since v3
     */
    teams2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List Stargazers. New implementation.
     * @http GET /repos/{owner}/{repo}/watchers
     * @since v3
     */
    watchers(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get archive link.
     * This method will return a 302 to a URL to download a tarball or zipball
     * archive for a repository. Please make sure your HTTP framework is
     * configured to follow redirects or you will need to use the Location header
     * to make a second GET request.
     * Note: For private repositories, these links are temporary and expire quickly.
     * @http GET /repos/{owner}/{repo}/{archive_format}/{path}
     * @since v3
     */
    repos5(owner: Http.Path<string>, repo: Http.Path<string>, archive_format: Http.Path<"tarball" | "zipball">, path: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List all public repositories.
     * This provides a dump of every public repository, in the order that they
     * were created.
     * Note: Pagination is powered exclusively by the since parameter. is the
     * Link header to get the URL for the next page of repositories.
     * @http GET /repositories
     * @since v3
     */
    repositories(since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description Search code.
     * @http GET /search/code
     * @since v3
     */
    code(order?: Http.Query<"desc" | "asc">, q: Http.Query<string>, sort?: Http.Query<"indexed">, Accept?: Http.Header<string>);
    /**
     * @description Find issues by state and keyword. (This method returns up to 100 results per page.)
     * @http GET /search/issues
     * @since v3
     */
    issues6(order?: Http.Query<"desc" | "asc">, q: Http.Query<string>, sort?: Http.Query<"updated" | "created" | "comments">, Accept?: Http.Header<string>);
    /**
     * @description Search repositories.
     * @http GET /search/repositories
     * @since v3
     */
    repositories1(order?: Http.Query<"desc" | "asc">, q: Http.Query<string>, sort?: Http.Query<"stars" | "forks" | "updated">, Accept?: Http.Header<string>);
    /**
     * @description Search users.
     * @http GET /search/users
     * @since v3
     */
    users(order?: Http.Query<"desc" | "asc">, q: Http.Query<string>, sort?: Http.Query<"followers" | "repositories" | "joined">, Accept?: Http.Header<string>);
    /**
     * @description Get team.
     * @http GET /teams/{teamId}
     * @since v3
     */
    teams3(teamId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete team.
     * In order to delete a team, the authenticated user must be an owner of the
     * org that the team is associated with.
     * @http DELETE /teams/{teamId}
     * @since v3
     */
    teams4(teamId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Edit team.
     * In order to edit a team, the authenticated user must be an owner of the org
     * that the team is associated with.
     * @http PATCH /teams/{teamId}
     * @since v3
     */
    teams5(teamId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List team members.
     * In order to list members in a team, the authenticated user must be a member
     * of the team.
     * @http GET /teams/{teamId}/members
     * @since v3
     */
    members3(teamId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description The "Get team member" API is deprecated and is scheduled for removal in the next major version of the API. We recommend using the Get team membership API instead. It allows you to get both active and pending memberships.
     *
     * Get team member.
     * In order to get if a user is a member of a team, the authenticated user mus
     * be a member of the team.
     * @http GET /teams/{teamId}/members/{username}
     * @deprecated v3
     * @since v3
     */
    members4(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description The API (described below) is deprecated and is scheduled for removal in the next major version of the API. We recommend using the Add team membership API instead. It allows you to invite new organization members to your teams.
     *
     * Add team member.
     * In order to add a user to a team, the authenticated user must have 'admin'
     * permissions to the team or be an owner of the org that the team is associated
     * with.
     * @http PUT /teams/{teamId}/members/{username}
     * @deprecated v3
     * @since v3
     */
    members5(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description The "Remove team member" API is deprecated and is scheduled for removal in the next major version of the API. We recommend using the Remove team membership API instead. It allows you to remove both active and pending memberships.
     *
     * Remove team member.
     * In order to remove a user from a team, the authenticated user must have 'admin'
     * permissions to the team or be an owner of the org that the team is associated
     * with.
     * NOTE This does not delete the user, it just remove them from the team.
     * @http DELETE /teams/{teamId}/members/{username}
     * @deprecated v3
     * @since v3
     */
    members6(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get team membership.
     * In order to get a user's membership with a team, the authenticated user must be a member of the team or an owner of the team's organization.
     * @http GET /teams/{teamId}/memberships/{username}
     * @since v3
     */
    memberships(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Add team membership.
     * In order to add a membership between a user and a team, the authenticated user must have 'admin' permissions to the team or be an owner of the organization that the team is associated with.
     *
     * If the user is already a part of the team's organization (meaning they're on at least one other team in the organization), this endpoint will add the user to the team.
     *
     * If the user is completely unaffiliated with the team's organization (meaning they're on none of the organization's teams), this endpoint will send an invitation to the user via email. This newly-created membership will be in the 'pending' state until the user accepts the invitation, at which point the membership will transition to the 'active' state and the user will be added as a member of the team.
     * @http PUT /teams/{teamId}/memberships/{username}
     * @since v3
     */
    memberships1(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Remove team membership.
     * In order to remove a membership between a user and a team, the authenticated user must have 'admin' permissions to the team or be an owner of the organization that the team is associated with. NOTE: This does not delete the user, it just removes their membership from the team.
     * @http DELETE /teams/{teamId}/memberships/{username}
     * @since v3
     */
    memberships2(teamId: Http.Path<int64>, username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List team repos
     * @http GET /teams/{teamId}/repos
     * @since v3
     */
    repos6(teamId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Check if a team manages a repository
     * @http GET /teams/{teamId}/repos/{owner}/{repo}
     * @since v3
     */
    repos7(teamId: Http.Path<int64>, owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description In order to add a repository to a team, the authenticated user must be an owner of the org that the team is associated with. Also, the repository must be owned by the organization, or a direct fork of a repository owned by the organization.
     * @http PUT /teams/{teamId}/repos/{owner}/{repo}
     * @since v3
     */
    repos8(teamId: Http.Path<int64>, owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description In order to remove a repository from a team, the authenticated user must be an owner of the org that the team is associated with. NOTE: This does not delete the repository, it just removes it from the team.
     * @http DELETE /teams/{teamId}/repos/{owner}/{repo}
     * @since v3
     */
    repos9(teamId: Http.Path<int64>, owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Get the authenticated user.
     * @http GET /user
     * @since v3
     */
    user(Accept?: Http.Header<string>);
    /**
     * @description Update the authenticated user.
     * @http PATCH /user
     * @since v3
     */
    user1(Accept?: Http.Header<string>);
    /**
     * @description List email addresses for a user.
     * In the final version of the API, this method will return an array of hashes
     * with extended information for each email address indicating if the address
     * has been verified and if it's primary email address for GitHub.
     * Until API v3 is finalized, use the application/vnd.github.v3 media type to
     * get other response format.
     * @http GET /user/emails
     * @since v3
     */
    emails(Accept?: Http.Header<string>);
    /**
     * @description Add email address(es).
     * You can post a single email address or an array of addresses.
     * @http POST /user/emails
     * @since v3
     */
    emails1(Accept?: Http.Header<string>);
    /**
     * @description Delete email address(es).
     * You can include a single email address or an array of addresses.
     * @http DELETE /user/emails
     * @since v3
     */
    emails2(Accept?: Http.Header<string>);
    /**
     * @description List the authenticated user's followers
     * @http GET /user/followers
     * @since v3
     */
    followers(Accept?: Http.Header<string>);
    /**
     * @description List who the authenticated user is following.
     * @http GET /user/following
     * @since v3
     */
    following(Accept?: Http.Header<string>);
    /**
     * @description Check if you are following a user.
     * @http GET /user/following/{username}
     * @since v3
     */
    following1(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Follow a user.
     * Following a user requires the user to be logged in and authenticated with
     * basic auth or OAuth with the user:follow scope.
     * @http PUT /user/following/{username}
     * @since v3
     */
    following2(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Unfollow a user.
     * Unfollowing a user requires the user to be logged in and authenticated with
     * basic auth or OAuth with the user:follow scope.
     * @http DELETE /user/following/{username}
     * @since v3
     */
    following3(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List issues.
     * List all issues across owned and member repositories for the authenticated
     * user.
     * @http GET /user/issues
     * @since v3
     */
    issues7(filter: Http.Query<"assigned" | "created" | "mentioned" | "subscribed" | "all">, state: Http.Query<"open" | "closed">, labels: Http.Query<string>, sort: Http.Query<"created" | "updated" | "comments">, direction: Http.Query<"asc" | "desc">, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description List your public keys.
     * Lists the current user's keys. Management of public keys via the API requires
     * that you are authenticated through basic auth, or OAuth with the 'user', 'write:public_key' scopes.
     * @http GET /user/keys
     * @since v3
     */
    keys4(Accept?: Http.Header<string>);
    /**
     * @description Create a public key.
     * @http POST /user/keys
     * @since v3
     */
    keys5(Accept?: Http.Header<string>);
    /**
     * @description Get a single public key.
     * @http GET /user/keys/{keyId}
     * @since v3
     */
    keys6(keyId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description Delete a public key. Removes a public key. Requires that you are authenticated via Basic Auth or via OAuth with at least admin:public_key scope.
     * @http DELETE /user/keys/{keyId}
     * @since v3
     */
    keys7(keyId: Http.Path<int64>, Accept?: Http.Header<string>);
    /**
     * @description List public and private organizations for the authenticated user.
     * @http GET /user/orgs
     * @since v3
     */
    orgs2(Accept?: Http.Header<string>);
    /**
     * @description List repositories for the authenticated user. Note that this does not include
     * repositories owned by organizations which the user can access. You can lis
     * user organizations and list organization repositories separately.
     * @http GET /user/repos
     * @since v3
     */
    repos10(type?: Http.Query<"all" | "public" | "private" | "forks" | "sources" | "member">, Accept?: Http.Header<string>);
    /**
     * @description Create a new repository for the authenticated user. OAuth users must supply
     * repo scope.
     * @http POST /user/repos
     * @since v3
     */
    repos11(Accept?: Http.Header<string>);
    /**
     * @description List repositories being starred by the authenticated user.
     * @http GET /user/starred
     * @since v3
     */
    starred1(direction?: Http.Query<string>, sort?: Http.Query<"created" | "updated">, Accept?: Http.Header<string>);
    /**
     * @description Check if you are starring a repository.
     * @http GET /user/starred/{owner}/{repo}
     * @since v3
     */
    starred2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Star a repository.
     * @http PUT /user/starred/{owner}/{repo}
     * @since v3
     */
    starred3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Unstar a repository
     * @http DELETE /user/starred/{owner}/{repo}
     * @since v3
     */
    starred4(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List repositories being watched by the authenticated user.
     * @http GET /user/subscriptions
     * @since v3
     */
    subscriptions(Accept?: Http.Header<string>);
    /**
     * @description Check if you are watching a repository.
     * @http GET /user/subscriptions/{owner}/{repo}
     * @deprecated v3
     * @since v3
     */
    subscriptions1(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Watch a repository.
     * @http PUT /user/subscriptions/{owner}/{repo}
     * @deprecated v3
     * @since v3
     */
    subscriptions2(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Stop watching a repository
     * @http DELETE /user/subscriptions/{owner}/{repo}
     * @deprecated v3
     * @since v3
     */
    subscriptions3(owner: Http.Path<string>, repo: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List all of the teams across all of the organizations to which the authenticated user belongs. This method requires user or repo scope when authenticating via OAuth.
     * @http GET /user/teams
     * @since v3
     */
    teams6(Accept?: Http.Header<string>);
    /**
     * @description Get all users.
     * This provides a dump of every user, in the order that they signed up for GitHub.
     * Note: Pagination is powered exclusively by the since parameter. Use the Link
     * header to get the URL for the next page of users.
     * @http GET /users
     * @since v3
     */
    users1(since?: Http.Query<int64>, Accept?: Http.Header<string>);
    /**
     * @description Get a single user.
     * @http GET /users/{username}
     * @since v3
     */
    users2(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
     * @http GET /users/{username}/events
     * @since v3
     */
    events7(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description This is the user's organization dashboard. You must be authenticated as the user to view this.
     * @http GET /users/{username}/events/orgs/{org}
     * @since v3
     */
    orgs3(username: Http.Path<string>, org: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List a user's followers
     * @http GET /users/{username}/followers
     * @since v3
     */
    followers1(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description Check if one user follows another.
     * @http GET /users/{username}/following/{targetUser}
     * @since v3
     */
    following4(username: Http.Path<string>, targetUser: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List a users gists.
     * @http GET /users/{username}/gists
     * @since v3
     */
    gists5(username: Http.Path<string>, since?: Http.Query<string>, Accept?: Http.Header<string>);
    /**
     * @description List public keys for a user.
     * Lists the verified public keys for a user. This is accessible by anyone.
     * @http GET /users/{username}/keys
     * @since v3
     */
    keys8(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List all public organizations for a user.
     * @http GET /users/{username}/orgs
     * @since v3
     */
    orgs4(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description These are events that you'll only see public events.
     * @http GET /users/{username}/received_events
     * @since v3
     */
    received_events(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List public events that a user has received
     * @http GET /users/{username}/received_events/public
     * @since v3
     */
    public1(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List public repositories for the specified user.
     * @http GET /users/{username}/repos
     * @since v3
     */
    repos12(username: Http.Path<string>, type?: Http.Query<"all" | "public" | "private" | "forks" | "sources" | "member">, Accept?: Http.Header<string>);
    /**
     * @description List repositories being starred by a user.
     * @http GET /users/{username}/starred
     * @since v3
     */
    starred5(username: Http.Path<string>, Accept?: Http.Header<string>);
    /**
     * @description List repositories being watched by a user.
     * @http GET /users/{username}/subscriptions
     * @since v3
     */
    subscriptions4(username: Http.Path<string>, Accept?: Http.Header<string>);
}
