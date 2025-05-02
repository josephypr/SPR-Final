from app import create_app

app = create_app('default')

app_context = app.app_context()
app_context.push()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


