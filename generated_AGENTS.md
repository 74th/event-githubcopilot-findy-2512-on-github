※ 指示の生成により生成した内容です

## システム概要
- Flask 製の API (`todo_api/`) と React + TypeScript 製の SPA (`todo_frontend/`) から成る最小構成の TODO アプリです。
- Python 側のツールは `uv` に統一されています（`pyproject.toml` 参照）。フロントは Create React App（`react-scripts`）のままです。
- `WEBROOT`（既定値 `todo_api/public`）が Flask の静的配信ディレクトリを決めます。フロントのビルド成果物をここに配置すればルーティング設定は不要です。

## バックエンド API (`todo_api/`)
- エントリーポイント `todo_api/server/api.py` で Flask を起動し、全リクエストを `OperationInteractor` に委譲しています。
- 公開エンドポイントは以下の 3 つだけです。
	- `GET /api/tasks` : 未完了タスクのみ返却。
	- `POST /api/tasks` : `{text}` を受け取り、Interactor 内で必ず `status="todo"` にセット。
	- `PATCH /api/tasks/<id>/done` : 指定 ID を `done` に更新。
- ビジネスルールは `domain/usecase/operations.py` の `OperationInteractor` が一元管理します。ルートハンドラにはロジックを書かないでください。
- タスクの正式なスキーマは `todo_api/domain/entity/entity.py` の TypedDict で、`status ∈ {"todo","done"}` に固定されています。項目を増やす場合はここから手を入れます。
- 疎通用の永続化は `todo_api/memdb/memdb.py` のインメモリ DB。読み書き時に dict をコピーし、`search_unfinished()` が `status == "todo"` のものだけ返すため、完了タスクは API レスポンスから消えます。
- 想定挙動は `todo_api/memdb/memdb_test.py` と `todo_api/domain/usecase/operations_test.py` がリファレンスになります。

## フロントエンド SPA (`todo_frontend/`)
- `src/App.tsx` が状態管理のハブで、`api/task.ts` からタスクを取得し `NewTaskForm` と `ListTaskView` に `reloadTasks()` を配布します。
- `NewTaskForm` は `react-hook-form` を使い、送信 payload は `{text}` のみ。ID/ステータスはすべてサーバー側が決めます。
- `ListTaskView` はカード UI を描画し、`TaskCard` は必ず `postTaskDone()` の後に `reloadTasks()` を呼びます。ローカル state を直接書き換えないこと。
- `src/api/task.ts` の fetch は CRA の proxy（`package.json` → `http://localhost:8080`）経由で動作する設計です。
- `src/entity/task.ts` の Task インターフェースはバックエンドと同じ形ですが、フォーム投稿を考慮して `id`/`status` はオプショナルです。

## 開発ワークフロー
- バックエンド起動: `uv run python -m todo_api.server.api`（ポート 8080。`todo_api/public` を自動 Serve）。
- フロント dev サーバー: `cd todo_frontend && pnpm start`（または `npm start`）。ポート 3000 で Flask にプロキシします。
- バックエンドテスト: `uv run python -m unittest discover -p "*_test.py" -v`
- フロントエンドテスト: `cd todo_frontend && pnpm test`（Jest / react-scripts）。
- 本番ビルド: `cd todo_frontend && pnpm build` 後、`todo_frontend/build/*` を `WEBROOT` 先に配置。

## 規約と落とし穴
- HTTP ハンドラは極力薄く保ち、状態遷移やバリデーションは `OperationInteractor` に閉じ込めます。
- `MemDB` が単一の真実ソースなので、ミューテーション後は必ず `reloadTasks()` で再取得してください。API は `done` タスクを返さないことを前提に UI を組む必要があります。
- 新しいフィールドやステータスを追加する場合は、`todo_api/domain/entity/entity.py`・`todo_frontend/src/entity/task.ts`・関連テストを同時に更新します。
- エンドポイントを増やすときは `todo_frontend/src/api/task.ts` に対応関数を追加し、`App.tsx` から新しいコールバックを配線して深い階層で state を触らないようにします。
- 静的アセットは Flask がそのまま配信します。SPA ルーティングを増やす場合も `WEBROOT` 配下にビルドを置けば `index.html` が解決されます。

## クイックリファレンス
- テストコードが永続化とビジネスルールのドキュメント代わりなので、データモデルを変える前に読んでください。

## 実装後にすること
- Pythonユニットテストを実行すること
