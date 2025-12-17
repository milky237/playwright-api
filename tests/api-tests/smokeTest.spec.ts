import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/POST_article.json';
import { faker } from '@faker-js/faker'
import { getNewRandomArticle } from '../../utils/data-generator';

test('Get articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200)
  await expect(response).shouldMatchSchema('articles', 'GET_articles')
  expect(response.articles.length).shouldBeLessThanOrEqual(10)
  expect(response.articlesCount).shouldEqual(10)

})

test('Get test tags', async ({ api }) => {
  const response = await api
    .path('/tags')
    .getRequest(200)
  await expect(response).shouldMatchSchema('tags', 'GET_tags')
  expect(response.tags[0]).shouldEqual('Test')
  expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create and delete article', async ({ api }) => {
  const articleRequest = getNewRandomArticle()
  const createArticleResponse = await api
    .path('/articles')
    .body(articleRequest)
    .postRequest(201)
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
  const slugId = createArticleResponse.article.slug

  const articlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')

  expect(articlesResponse.articles[0].title).shouldEqual(articleRequest.article.title)

  await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204)

  const articlesResponseAfterDelete = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponseAfterDelete).shouldMatchSchema('articles', 'GET_articles')

  expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual(articleRequest.article.title)

})

test('Create, update and delete article', async ({ api }) => {
  const articleRequest = getNewRandomArticle()
  const createArticleResponse = await api
    .path('/articles')
    .body(articleRequest)
    .postRequest(201)
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')

  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
  const slugId = createArticleResponse.article.slug

  const articleRequest2 = getNewRandomArticle()

  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body(articleRequest2)
    .putRequest(200)
  await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles')

  expect(updateArticleResponse.article.title).shouldEqual(articleRequest2.article.title)
  const newSlugId = updateArticleResponse.article.slug

  const articlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles')

  expect(articlesResponse.articles[0].title).shouldEqual(articleRequest2.article.title)

  await api
    .path(`/articles/${newSlugId}`)
    .deleteRequest(204)

  const articlesResponseAfterDelete = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)
  await expect(articlesResponseAfterDelete).shouldMatchSchema('articles', 'GET_articles')

  expect(articlesResponseAfterDelete.articles[0].title).not.shouldEqual(articleRequest2.article.title)

})