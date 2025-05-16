from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, ToDo

app = Flask(__name__)
CORS(app)

# SQLite 設定
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# テーブル作成
with app.app_context():
    db.create_all()

# ToDo 一覧取得
@app.route("/todos", methods=["GET"])
def get_todos():
    todos = ToDo.query.all()
    return jsonify([todo.to_dict() for todo in todos])

# ToDo 追加
@app.route("/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    new_todo = ToDo(task=data["task"])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

# ToDo 削除
@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = ToDo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# ToDo 完了トグル
@app.route("/todos/<int:todo_id>/toggle", methods=["PATCH"])
def toggle_todo(todo_id):
    todo = ToDo.query.get_or_404(todo_id)
    todo.is_done = not todo.is_done
    db.session.commit()
    return jsonify(todo.to_dict()), 200

if __name__ == "__main__":
    app.run(debug=True)