import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { getNewRandomArticle } from '../../utils/data-generator';

test('HAR Flow - Create Article with Comments', async ({ api }) => {
    // Step 3: Create article with random data
    const createArticleRequest = getNewRandomArticle()
    const createArticleResponse = await api
        .path('/articles')
        .body(createArticleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles', true)
    await expect(createArticleResponse.article.title).shouldEqual(createArticleRequest.article.title)
    const articleSlug = createArticleResponse.article.slug

    // Step 4: Get specific article by slug
    const getArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200)
    await expect(getArticleResponse).shouldMatchSchema('articles', 'GET_articles', true)
    await expect(getArticleResponse.article.slug).shouldEqual(articleSlug)
    await expect(getArticleResponse.article.title).shouldEqual(createArticleRequest.article.title)

    // Step 5: Get comments for article (should be empty initially)
    const getCommentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(getCommentsResponse).shouldMatchSchema('comments', 'GET_articles_comments', true)
    await expect(Array.isArray(getCommentsResponse.comments)).shouldEqual(true)
    await expect(getCommentsResponse.comments.length).shouldEqual(0)

    // Step 6: Create comment on article
    const commentBody = 'Great article! Very informative and well-structured.'
    const createCommentRequest = {
        comment: {
            body: commentBody
        }
    }

    const createCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body(createCommentRequest)
        .postRequest(200)
    await expect(createCommentResponse).shouldMatchSchema('comments', 'POST_articles_comments', true)
    await expect(createCommentResponse.comment.body).shouldEqual(commentBody)

    const commentId = createCommentResponse.comment.id

    // Step 7: Get comments again to verify comment was created
    const getCommentsAfterResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(getCommentsAfterResponse).shouldMatchSchema('comments', 'GET_articles_comments', true)
    await expect(getCommentsAfterResponse.comments[0].body).shouldEqual(commentBody)
});
